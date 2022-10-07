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
import { ReservationService } from '../reservations/reservations.service';
import { ReservationsDto } from '../reservations/reservations.dto';

const removeLastSlash = (url: string) => {
  return (url[url.length - 1] === '/') ? url.substring(0, url.length - 1) : url
}

// NOTE: the route is defined in frontend/paymentstatus-modal
// This is the final phase of the payment process, after call to PAYMENT_RETURN_URL.
const PAYMENT_STATUS_URL = removeLastSlash(process.env.APP_BASE_URL) + '/consumer/payment';

// Paytrail API docs:
// https://docs.paytrail.com/#/?id=payments
// https://docs.paytrail.com/#/payment-method-providers?id=test-credentials

@Controller('/api/payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly reservationService: ReservationService,
  ) { }

  // Frontend calls this first when initiating a payment. After this, possible payment methods will be shown to the user.
  // After selecting the payment method, the Paytrail API is called and user is redirected to PAYMENT_RETURN_URL with status info about the payment.
  @Post('make-payment')
  @UsePipes(new ValidationPipe())
  async makePayment(@Res() response, @Body() reservation: ReservationsDto) {
    try {
      console.log((new Date).toLocaleString() + ": make-payment called");
      const seatsAvailable = await this.reservationService.checkSeatAvailability(reservation);
      if (!seatsAvailable) {
        return response
          .status(422)
          .json(`There are not enough seats available for this event`);
      } else {
        reservation.payment_required = true;
        const reservationDto = await this.reservationService.createReservation(reservation, false);
        console.log('reservation created for user', reservationDto);

        if (!reservationDto) {
          return response
            .status(422)
            .json(`Failed to make a reservation for the request`);
        } else {
          const paymentObj = {
            amount: await this.reservationService.getTotalAmount(reservationDto),
            reservation_id: reservationDto.id,
            email: reservationDto.email
          };

          // This corresponds to Paytrail API docs "Initiate new payment (POST /payments)"
          const paymentProviders = await this.paymentService.getPaymentProviders(paymentObj);
          if (!paymentProviders) {
            return response.status(422).json(`Failed to make payment for the request: could not get payment providers.`);
          } else {
            console.log("make-payment response");
            response.status(200).json({providers: paymentProviders});
          }
        }
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to make payment for the request: ${error.message}`);
    }
  }

  // Check query string for technical validity.
  // Return true if everyting OK.
  checkQueryValidity(query: any): boolean {
    if (!query['checkout-status']) {
      console.error('Query is missing checkout-status.');
      return false;
    }
    if (!query['checkout-stamp']) {
      console.error('Query is missing checkout-stamp.');
      return false;
    }
    const signature = this.paymentService.calculateCheckoutParamsHmac(query, '');
    if (signature != query['signature']) {
      console.error(`Query signature doesn't match computed.`);
      return false;
    }
    return true;
  }

  // After a payment this URL will be called as the payer is redirected here.
  // This corresponds to Paytrail API docs "Redirect to Merchant success/cancel URL / Return to success/cancel".
  //
  // The redirect to PAYMENT_STATUS_URL afterwards corresponds to Paytrail API docs "Render thank you -page".
  // For status codes, see frontend/paymentstatus-modal.
  //
  // NOTE: failed reservations (payment has failed/been cancelled etc.) are cleared here or later when querying a reservation.
  // Payment and other related entities are deleted by cascade rules.
  // Therefore we don't have a separate payment callback/redirect URL for cancelled payments.
  @Get('/payment-return')
  @UsePipes(new ValidationPipe())
  async payment_return(@Req() req, @Res() res) {
    try {
      console.log((new Date).toLocaleString() + ": payment-return called");

      if (!this.checkQueryValidity(req.query)) {
        console.error('Query failed validity check.');
        return res.redirect(`${PAYMENT_STATUS_URL}?status=3`);
      }

      const checkoutStatus = req.query['checkout-status'];
      const orderNumber = req.query['checkout-stamp'];
      console.log('Payment checkout status', checkoutStatus, 'order number', orderNumber);

      const payment = await this.paymentService.getPaymentByOrderNumber(orderNumber);
      if (!payment) {
        console.error(`Payment details not available in the system. Payment order number: ${orderNumber}`);
        return res.redirect(`${PAYMENT_STATUS_URL}?status=1`);
      }

      if (checkoutStatus !== 'ok') {
        console.log('Deleting reservation since payment failed', payment.reservation_id);
        await this.reservationService.deleteReservation(payment.reservation_id);
        return res.redirect(`${PAYMENT_STATUS_URL}?status=3`);
      }

      const reservation = await this.reservationService.findOneById(payment.reservation_id);
      if (payment.payment_status) {
        console.error(`This payment was already processed!. Payment order number: ${payment.order_number}`);
        return res.redirect(`${PAYMENT_STATUS_URL}?status=2&event_id=${reservation.event_id}`);
      }
      console.log("Updating reservation and payment, sending SMS.");
      const [, , smsResponse] = await Promise.all([
        await this.reservationService.updateReservation(reservation.id, { confirmed: true, payment_completed: true }),
        await this.paymentService.updatePayment(payment.order_number, { payment_status: true }),
        await this.paymentService.sendSmsToUser(payment.reservation_id)
      ]);

      let return_status = 5;
      if (smsResponse) {
        console.log("Updating reservation for successfully sent SMS.");
        await this.reservationService.updateReservation(reservation.id, { sms_sent: true });
        return_status = 0;
      }

      console.log("payment-return response");
      return res.redirect(
        `${PAYMENT_STATUS_URL}?orderNumber=${orderNumber}&amount=${payment.amount}` +
        `&status=${return_status}&event_id=${reservation.event_id}`);

    } catch (err) {
      console.error(`Payment failed with error code: ${err.message}. Please try again later`);
      return res.redirect(`${PAYMENT_STATUS_URL}?status=4`);
    }
  }

}
