import axios from 'axios';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from './payment.entity';
import { Repository } from 'typeorm';
import { ReservationService } from '../reservations/reservations.service';
import { EventsService } from '../event/events.service';
import { I18Service } from '../i18/i18.service';
import { format } from 'date-fns';
import { EventsDto } from '../event/events.dto';
import { SMSService } from '../notifications/sms/sms.service';
import { ReservationsDto } from '../reservations/reservations.dto';
import { PriceService } from '../price/price.service';
import { PaymentsDto } from './payment.dto';
import * as crypto from 'crypto';

const stringInterpolator = require('interpolate');

const removeLastSlash = (url: string) => {
  return (url[url.length - 1] === '/') ? url.substring(0, url.length - 1) : url
}

// Default values are Paytrail test credentials.
const MERCHANT_ID = process.env.MERCHANT_ID || '375917';
const MERCHANT_KEY = process.env.MERCHANT_KEY || 'SAIPPUAKAUPPIAS';
const PAYMENT_RETURN_URL = removeLastSlash(process.env.APP_BASE_URL) + '/api/payments/payment-return';
const PAYMENT_POST_URL = process.env.PAYMENT_POST_URL || 'https://services.paytrail.com/payments';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payments)
    private readonly paymentRepository: Repository<Payments>,
    private readonly reservationService: ReservationService,
    private readonly eventService: EventsService,
    private readonly i18Service: I18Service,
    private readonly smsService: SMSService,
    private readonly priceService: PriceService,
  ) { }

  async getPaymentProviders(paymentObj: {amount: number, reservation_id: number, email: string}) {
    try {
      const paymentPostConfig = await this.getAxiosConfig(paymentObj);
      const response = await axios(paymentPostConfig);
      return response.data.providers;
    } catch (error) {
      console.error(`Failed to get payment methods: ${error.message}`);
      return null;
    }
  }

  async getPaymentByOrderNumber(orderNumber: string) {
    return await this.paymentRepository.findOne({
      where: { order_number: orderNumber },
    });
  }

  async getPaymentByReservationId(reservationId: number) {
    return await this.paymentRepository.findOne({
      where: { reservation_id: reservationId },
    });
  }

  async getOne(id: number) {
    return await this.paymentRepository.findOne({where:{id}});
  }

  async delete(id: number) {
    return await this.paymentRepository.delete(id);
  }

  async updatePayment(orderNumber: string, payment: Partial<PaymentsDto>) {
    const paymentFromDb = await this.getPaymentByOrderNumber(orderNumber);
    const paymentToUpdate = {
      ...paymentFromDb,
      ...payment
    }
    await this.paymentRepository.update(paymentFromDb.id, paymentToUpdate);
  }

  async sendSmsToUser(id: number) {
    const reservation = await this.reservationService.findOneById(id);
    const event = await this.eventService.findOneById(reservation.event_id);
    const reservationMessage = await this.buildPaymentMessage(event, reservation);
    return await this.smsService.sendMessageToUser(
      reservation.phone,
      reservation.name,
      reservationMessage,
    );
  }

  async buildPaymentMessage(event: EventsDto, reservation: ReservationsDto) {
    const time = event.event_time.replace(/:/g, '.')
    const date = this.getDate(event.event_date);
    const name = event.name;
    const location = event.location;
    const ticketDetails = await Promise.all(reservation.tickets.map(async ticket => {
      const priceDetails = await this.priceService.getPriceDetails(ticket.price_id);
      return (
        (`${priceDetails.ticket_description}:  ${priceDetails.price} €  (${ticket.no_of_tickets} kpl)`)
      )
    }));
    const ticketDetailString = ticketDetails.join('\n');
    const personName = reservation.name;
    const producerDetail = event.contact_information;
    const message = stringInterpolator(
      this.i18Service.getContents().payments.confirmation,
      {
        personName,
        name,
        location,
        date,
        time,
        ticketDetailString,
        producerDetail,
      },
    );
    return message;
  }

  getDate(date) {
    return format(date, this.i18Service.getContents().payments.dateFormat);
  }

  calculateCheckoutParamsHmac(params, body): string {
    const hmacPayload = Object.keys(params)
      .sort()
      .filter(h => h.substring(0, "checkout-".length) === "checkout-")
      .map((key) => [key, params[key]].join(':'))
      .concat(body ? JSON.stringify(body) : '')
      .join('\n');

    return crypto.createHmac('sha256', MERCHANT_KEY).update(hmacPayload).digest('hex');
  };

  async getAxiosConfig(paymentObj: {amount: number, reservation_id: number, email: string}) {
    const timestamp = new Date();
    const orderNumber = 'vantaa-order-' + timestamp.valueOf();
    const headers = {
      'checkout-account': MERCHANT_ID,
      'checkout-algorithm': 'sha256',
      'checkout-method': 'POST',
      'checkout-nonce': orderNumber,
      'checkout-timestamp': timestamp.toISOString(),
    };

    const body = {
      'stamp': orderNumber,
      'reference': paymentObj.reservation_id.toString(),
      'amount': paymentObj.amount,
      'currency': 'EUR',
      'language': 'FI',
      'customer': {
        'email': paymentObj.email
      },
      'redirectUrls': {
        'success': PAYMENT_RETURN_URL,
        'cancel': PAYMENT_RETURN_URL
      }
    }

    const signature = this.calculateCheckoutParamsHmac(headers, body);
    const paymentEntity = new Payments();
    paymentEntity.reservation_id = paymentObj.reservation_id;
    paymentEntity.order_number = orderNumber;
    paymentEntity.auth_code = signature;
    paymentEntity.username = paymentObj.email;
    paymentEntity.payment_status = false;
    paymentEntity.payment_date = timestamp.toISOString();
    paymentEntity.amount = paymentObj.amount;

    const paymentResponse = await this.paymentRepository.save(paymentEntity);
    if (paymentResponse.id) {
      console.log('Payment saved to database: ', paymentResponse);
      const config = {
        url: PAYMENT_POST_URL,
        method: 'post',
        headers: {...headers, signature},
        data: body
      };
      return config;
    } else {
      throw new Error('Failed to save payment with order number: ' + paymentResponse.order_number);
    }
  }

}
