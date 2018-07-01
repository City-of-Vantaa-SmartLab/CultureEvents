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
          return res.redirect(`/app/payment-complete?status=1`);
        }

        // Checking if the payment has already been done.
        if (payment.payment_status) {
          console.error(
            `This payment was already processed!. Payment Order: ${
              payment.order_number
            }`,
          );
          return res.redirect(`/app/payment-complete?status=2`);
        } else {
          // Updating payment as completed.
          payment.payment_status = true;
          await this.paymentService.updatePaymentStatus(
            payment.order_number,
            true,
          );
        }
        res.redirect(
          `/app/payment-complete?orderNumber=${orderNumber}&amount=${
            payment.amount
          }&status=0`,
        );
      } else {
        console.error(
          `Payment failed with error code: ${response}. Please try again later`,
        );
        return res.redirect(`/app/payment-complete?status=3`);
      }
    } catch (err) {
      console.error(
        `Payment failed with error code: ${
          err.message
        }. Please try again later`,
      );
      return res.redirect(`/app/payment-complete?status=4`);
    }
  }

  @Get('/payment-redirect')
  @UsePipes(new ValidationPipe())
  async payment_redirect(@Req() req, @Res() res) {
    try {
      const amount = +req.query.amount;
      const id = +req.query.id;

      const validationErrors = this.validationService.validatePaymentRedirectRequest(
        id,
        amount,
      );
      if (validationErrors) {
        return res.status(422).json(validationErrors);
      }
      const reservations = await this.reservationService.findOneById(id);

      if (reservations) {
        const paymentObj = {
          amount,
          reservation_id: reservations.id,
          username: reservations.username,
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
}
