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
const payment_return_url = process.env.PAYMENT_RETURN_URL || '/api/payments/payment-return';

// WIP: move from Vismapay to Paytrail
// Default values are Paytrail test credentials.
// const merchant_id = process.env.MERCHANT_ID || '375917';
// const merchant_key = process.env.MERCHANT_KEY || 'SAIPPUAKAUPPIAS';
const secret = process.env.BAMBORA_SECRET_KEY || 'SECRET_KEY';
const apiKey = process.env.BAMBORA_API_KEY || 'API_KEY';
const bamboraProductID = process.env.BAMBORA_PRODUCT_ID;
const bamboraProductTitle = process.env.BAMBORA_PRODUCT_TITLE;
const payemnt_notify_url = process.env.PAYMENT_NOTIFY_URL || '/api/payments/payment-notify';
const TOKEN_URL = 'https://www.vismapay.com/pbwapi/auth_payment';
const BAMBORA_API_URL = 'https://www.vismapay.com/pbwapi/token/';

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

  async getPaymentRedirectUrl(paymentObj) {
    try {
      const paymentEntity = this.createPaymentEntity(paymentObj);
      console.log('saving payment to database', paymentEntity);
      const paymentResponse = await this.paymentRepository.save(paymentEntity);
      console.log('paymentResponse: ', paymentResponse);
      if (paymentResponse.id) {
        const paymentRequest = this.createPaymentRequest(paymentResponse);
        const response = await axios.post(TOKEN_URL, paymentRequest);
        const redirectUrl = BAMBORA_API_URL + response.data.token;
        return redirectUrl;
      } else {
        console.log('failed to save payment', paymentResponse);
        return null;
      }
    } catch (error) {
      console.error(`Failed to get redirect url from bambora: ${error.message}`);
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

  createPaymentEntity(paymentModel) {
    const orderNumber = 'vantaa-order-' + Date.now();
    const message = apiKey + '|' + orderNumber;
    const authCode = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex')
      .toUpperCase();

    paymentModel.auth_code = authCode;
    paymentModel.order_number = orderNumber;
    paymentModel.payment_status = false;
    paymentModel.payment_date = new Date();
    return paymentModel;
  }

  createPaymentRequest(paymentModel) {
    const amount = paymentModel.amount * 100;
    let preTaxAmount = amount;
    try {
      return {
        version: 'w3.1',
        api_key: apiKey,
        order_number: paymentModel.order_number,
        amount: amount,
        currency: 'EUR',
        payment_method: {
          type: 'e-payment',
          return_url: payment_return_url,
          notify_url: payemnt_notify_url,
          lang: 'fi',
          selected: ['banks', 'creditcards'],
        },
        authcode: paymentModel.auth_code,
        customer: {
          firstname: paymentModel.username,
        },
        products: [
          {
            id: bamboraProductID,
            title: bamboraProductTitle,
            count: 1,
            pretax_price: preTaxAmount,
            tax: 0,
            price: amount,
            type: 1,
          },
        ],
      };
    } catch (error) {
      console.error('failed to create Bambora Payment Request', error);
    }

  }

}
