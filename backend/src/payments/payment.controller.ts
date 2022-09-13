import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  UsePipes,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ValidationPipe } from '../validations/validation.pipe';
import { ValidationService } from '../utils/validations/validations.service';
import { ReservationService } from '../reservations/reservations.service';
import { ReservationsDto } from '../reservations/reservations.dto';

// NOTE: the route is defined in frontend/paymentstatus-modal
const APP_REDIRECT_URL =
  process.env.APP_REDIRECT_URL || '/consumer/payment';

@Controller('/api/payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly validationService: ValidationService,
    private readonly reservationService: ReservationService,
  ) { }

  BamboraReturnCodes = {
    SUCCESS: '0',
  };

  @Get('/payment-details')
  @UsePipes(new ValidationPipe())
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

  // This is called when returning after a payment URL redirect.
  // It is crucial to have the correct environment variable to point to this endpoint.
  @Get('/payment-return')
  @UsePipes(new ValidationPipe())
  async payment_return(@Req() req, @Res() res) {
    try {
      const bamboraReturnCode = req.query.RETURN_CODE;
      const orderNumber = req.query.ORDER_NUMBER;
      console.log('bamboraCode', bamboraReturnCode, 'orderNumber', orderNumber);
      const payment = await this.paymentService.getPaymentByOrderNumber(orderNumber);
      console.log('Got payment.');

      if (bamboraReturnCode !== this.BamboraReturnCodes.SUCCESS) {
        //delete reservation since payment failed
        if (payment) {
          console.log('deleting reservation since payment failed at Bambora', payment.reservation_id);
          await this.reservationService.deleteReservation(payment.reservation_id);
        }
        console.error(
          `Payment failed with error code: ${bamboraReturnCode}. Please try again later`,
        );
        return res.redirect(`${APP_REDIRECT_URL}?status=3`);
      }

      if (!payment) {
        console.error(
          `Payment details not available in the system. Payment Order: ${orderNumber}`,
        );
        return res.redirect(`${APP_REDIRECT_URL}?status=1`);
      }

      const reservation = await this.reservationService.findOneById(payment.reservation_id);
      console.log('Got reservation.');

      // Checking if the payment has already been done.
      if (payment.payment_status) {
        console.error(`This payment was already processed!. Payment Order: ${payment.order_number}`);
        return res.redirect(`${APP_REDIRECT_URL}?status=2&event_id=${reservation.event_id}`);
      }

      console.log("Updating reservation and payment, sending SMS.");
      const [, , smsResponse] = await Promise.all([
        await this.reservationService.updateReservation(reservation.id, { confirmed: true, payment_completed: true }),
        await this.paymentService.updatePayment(payment.order_number, { payment_status: true }),
        await this.paymentService.sendSmsToUser(payment.reservation_id)
      ]);

      if (smsResponse) {
        console.log("Updating reservation for successfully sent SMS.");
        await this.reservationService.updateReservation(reservation.id, { sms_sent: true });
        return res.redirect(
          `${APP_REDIRECT_URL}?orderNumber=${orderNumber}&amount=${payment.amount}` +
          `&status=0&event_id=${reservation.event_id}`);
      }

      return res.redirect(
        `${APP_REDIRECT_URL}?orderNumber=${orderNumber}&amount=${payment.amount}` +
        `&status=5&event_id=${reservation.event_id}`);

    } catch (err) {
      console.error(`Payment failed with error code: ${err.message}. Please try again later`);
      return res.redirect(`${APP_REDIRECT_URL}?status=4`);
    }
  }

  @Get('/payment-redirect')
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
  @UsePipes(new ValidationPipe())
  async makePayment(@Res() response, @Body() reservation: ReservationsDto) {
    try {
      const seatsAvailable = await this.reservationService.checkSeatAvailability(
        reservation,
      );
      if (!seatsAvailable) {
        return response
          .status(422)
          .json(`There are not enough seats available for this event`);
      } else {
        reservation.payment_required = true;
        const reservationDto = await this.reservationService.createReservation(
          reservation,
          false,
        );
        console.log('reservation created for user', reservationDto);

        if (!reservationDto) {
          return response
            .status(422)
            .json(`Failed to make a reservation for the request`);
        } else {
          const paymentObj = {
            amount: await this.reservationService.getTotalAmount(reservationDto),
            reservation_id: reservationDto.id,
            username: reservationDto.name,
          };
          console.log('making payment for object', paymentObj);
          const redirectUrl = await this.paymentService.getPaymentRedirectUrl(
            paymentObj,
          );
          if (!redirectUrl) {
            return response
              .status(422)
              .json(
                `Failed to make payment for the request: Could not make payment request with Bambora`,
              );
          } else {
            response.status(200).json({ redirect_url: redirectUrl });
          }
        }
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to make payment for the request: ${error.message}`);
    }
  }
}
