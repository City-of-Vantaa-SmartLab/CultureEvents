import axios from 'axios';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from './payment.entity';
import { Repository } from 'typeorm';
import { BamboraService } from 'services/bambora.service';
import { ReservationService } from 'reservations/reservations.service';
import { EventsService } from 'event/events.service';
import { I18Service } from 'i18/i18.service';
import { format } from 'date-fns';
import { EventsDto } from 'event/events.dto';
import { SMSService } from 'notifications/sms/sms.service';
import * as stringInterpolator from 'interpolate';
import { ReservationsDto } from 'reservations/reservations.dto';
import { PriceService } from 'price/price.service';

const TOKEN_URL = 'https://payform.bambora.com/pbwapi/auth_payment';
const BAMBORA_API_URL = 'https://payform.bambora.com/pbwapi/token/';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payments)
    private readonly paymentRepository: Repository<Payments>,
    private readonly bamboraService: BamboraService,
    private readonly reservationService: ReservationService,
    private readonly eventService: EventsService,
    private readonly i18Service: I18Service,
    private readonly smsService: SMSService,
    private readonly priceService: PriceService,
  ) { }

  async getPaymentRedirectUrl(paymentObj) {
    try {
      const paymentEntity = await this.bamboraService.createPaymentModel(
        paymentObj,
      );
      // Saves the payment request to database
      await this.paymentRepository.save(paymentEntity);
      const paymentRequest = await this.bamboraService.createBamboraPaymentRequest(
        paymentEntity,
      );
      const response = await axios.post(TOKEN_URL, paymentRequest);
      const redirectUrl = BAMBORA_API_URL + response.data.token;
      return redirectUrl;
    } catch (error) {
      console.log(`Failed to get redirect url from bambora: ${error.message}`);
      return null;
    }
  }

  async getPaymentByOrderNumber(orderNumber: string) {
    return await this.paymentRepository.findOne({
      where: { order_number: orderNumber },
    });
  }

  async updatePaymentStatus(orderNumber: string, payment_status: boolean) {
    const payment = await this.getPaymentByOrderNumber(orderNumber);
    payment.payment_status = payment_status;
    this.paymentRepository.save(payment);
  }

  async sendSmsToUser(id: number, amount: number) {
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
    const time = this.getTime(event.event_date);
    const date = this.getDate(event.event_date);
    const name = event.name;
    const location = event.location;
    const ticketDetails = await Promise.all(reservation.tickets.map(async ticket => {
      const priceDetails = await this.priceService.getPriceDetails(ticket.price_id);
      return (
        (`${priceDetails.ticket_description}  ${priceDetails.price} €  ${ticket.no_of_tickets} kpl`)
      )
    }));
    const ticketDetailString = ticketDetails.join('\n');
    const personName = reservation.name;
    const message = stringInterpolator(
      this.i18Service.getContents().payments.confirmation,
      {
        personName,
        name,
        location,
        date,
        time,
        ticketDetailString
      },
    );
    return message;
  }

  getTime(date) {
    return format(date, this.i18Service.getContents().payments.timeFormat);
  }

  getDate(date) {
    return format(date, this.i18Service.getContents().payments.dateFormat);
  }
}
