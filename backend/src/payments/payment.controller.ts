import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Param,
  Body,
  UsePipes,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ValidationPipe } from 'validations/validation.pipe';
import { ValidationService } from '../utils/validations/validations.service';
import { ReservationService } from 'reservations/reservations.service';
import { BamboraService } from 'services/bambora.service';
import {
  ApiUseTags,
  ApiImplicitQuery,
  ApiImplicitParam,
} from '@nestjs/swagger';
import { ReservationsDto } from '../reservations/reservations.dto';
const APP_REDIRECT_URL =
  process.env.APP_REDIRECT_URL || '/app/payment-complete';
@ApiUseTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly validationService: ValidationService,
    private readonly reservationService: ReservationService,
  ) {}

  BamboraReturnCodes = {
    SUCCESS: '0',
  };

  @Get('/payment-details')
  @UsePipes(new ValidationPipe())
  @ApiImplicitQuery({
    name: 'order_number',
    description: 'order number of the order to be retrieved',
    required: true,
    type: String,
  })
  async get_payment_details(@Req() req, @Res() res) {
    try {
      const orderNumber = req.query.order_number;
      const validationErrors = this.validationService.validateOrderNumber(
        orderNumber,
      );
      if (validationErrors) {
        return res.status(422).json(validationErrors);
      }

      const payment = await this.paymentService.getPaymentByOrderNumber(
        orderNumber,
      );
      if (!payment) {
        return res
          .status(422)
          .json('Payment details not available in the system.');
      }

      const paymentDetails = {
        amount: payment.amount,
        status: payment.payment_status,
      };
      res.status(200).json(paymentDetails);
    } catch (err) {
      res
        .status(500)
        .json(`Failed to get payment details. Error: ${err.message}`);
    }
  }

  @Get('/payment-return')
  @ApiImplicitQuery({ name: 'RETURN_CODE', required: true, type: String })
  @ApiImplicitQuery({ name: 'ORDER_NUMBER', required: true, type: String })
  @UsePipes(new ValidationPipe())
  async payment_return(@Req() req, @Res() res) {
    try {
      const response = req.query.RETURN_CODE;
      if (response === this.BamboraReturnCodes.SUCCESS) {
        const orderNumber = req.query.ORDER_NUMBER;
        const payment = await this.paymentService.getPaymentByOrderNumber(
          orderNumber,
        );
        if (!payment) {
          console.error(
            `Payment details not available in the system. Payment Order: ${
              payment.order_number
            }`,
          );
          return res.redirect(`${APP_REDIRECT_URL}?status=1`);
        }

        const reservation_details = await this.reservationService.findOneById(
          payment.reservation_id,
        );
        // Checking if the payment has already been done.
        if (payment.payment_status) {
          console.error(
            `This payment was already processed!. Payment Order: ${
              payment.order_number
            }`,
          );
          return res.redirect(
            `${APP_REDIRECT_URL}?status=2&event_id=${reservation_details.id}`,
          );
        } else {
          // Updating payment as completed.
          payment.payment_status = true;
          await this.paymentService.updatePaymentStatus(
            payment.order_number,
            true,
          );
        }
        res.redirect(
          `${APP_REDIRECT_URL}?orderNumber=${orderNumber}&amount=${
            payment.amount
          }&status=0&event_id=${reservation_details.id}`,
        );
      } else {
        console.error(
          `Payment failed with error code: ${response}. Please try again later`,
        );
        return res.redirect(`${APP_REDIRECT_URL}?status=3`);
      }
    } catch (err) {
      console.error(
        `Payment failed with error code: ${
          err.message
        }. Please try again later`,
      );
      return res.redirect(`${APP_REDIRECT_URL}?status=4`);
    }
  }

  @Get('/payment-redirect')
  @ApiImplicitQuery({
    name: 'amount',
    description: 'Amount to be Paid.',
    required: true,
    type: String,
  })
  @UsePipes(new ValidationPipe())
  async payment_redirect(@Req() req, @Res() res) {
    try {
      const id = +req.query.id;

      const validationErrors = this.validationService.validateId(id);
      if (validationErrors) {
        return res.status(422).json(validationErrors);
      }
      const reservations = await this.reservationService.findOneById(id);

      if (reservations) {
        const paymentObj = {
          amount: await this.reservationService.getTotalAmount(reservations),
          reservation_id: reservations.id,
          username: reservations.name,
        };
        const url = await this.paymentService.getPaymentRedirectUrl(paymentObj);
        res.status(301).redirect(url);
      } else {
        return res.status(422).json(`Failed to get reservation with id: ${id}`);
      }
    } catch (err) {
      res
        .status(500)
        .json(`Failed to get payment redirect url. Error: ${err.message}`);
    }
  }

  @Post('make-payment')
  @ApiImplicitParam({
    name: 'reservation',
    required: true,
    description: 'Reservation Object',
    type: String,
  })
  @UsePipes(new ValidationPipe())
  async makePayment(@Res() response, @Body() reservation: ReservationsDto) {
    try {
      const checkIfSoldOut = await this.reservationService.checkSeatAvailability(
        reservation,
      );
      if (checkIfSoldOut) {
        return response
          .status(422)
          .json(`There are not enough seats available for this event`);
      }
      const reservationDto = await this.reservationService.createReservation(
        reservation,
        false,
      );

      if (!reservationDto) {
        return response
          .status(422)
          .json(`Failed to make a reservation for the request`);
      }
      const paymentObj = {
        amount: await this.reservationService.getTotalAmount(reservationDto),
        reservation_id: reservationDto.id,
        username: reservationDto.name,
      };
      const redirectUrl = await this.paymentService.getPaymentRedirectUrl(
        paymentObj,
      );
      if (!redirectUrl) {
        return response
          .status(422)
          .json(
            `Failed to make payment for the request: Could not make payment request with Bambora`,
          );
      }
      response.status(301).redirect(redirectUrl);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to make payment for the request: ${error.message}`);
    }
  }
}
