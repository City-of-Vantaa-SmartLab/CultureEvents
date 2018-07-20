import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservations } from './reservations.entity';
import { ReservationsDto } from './reservations.dto';
import { Price } from 'price/price.entity';
import { SMSService } from 'notifications/sms/sms.service';
import { EventsDto } from 'event/events.dto';
import { format } from 'date-fns';
import { I18Service } from '../i18/i18.service';
import { EventsService } from 'event/events.service';
import { Tickets } from 'tickets/tickets.entity';
import { PriceDto } from 'price/price.dto';
import { PriceService } from 'price/price.service';
import * as stringInterpolator from 'interpolate';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>,
    private readonly smsService: SMSService,
    private readonly i18Service: I18Service,
    private readonly eventService: EventsService,
    private readonly priceService: PriceService,
  ) {}

  async createReservation(reservation: ReservationsDto, sendSms: boolean) {
    const response = await this.reservationsRepository.save(reservation);
    if (response) {
      if (sendSms) {
        const smsResponse = await this.sendSmsToUser(reservation);
        if (smsResponse) {
          await Promise.all(
            reservation.tickets.map(
              async ticket =>
                await this.priceService.increaseOccupiedSeats(
                  ticket.price_id,
                  ticket.no_of_tickets,
                ),
            ),
          );
          this.updateReservationStatus(reservation.id, true);
          return response;
        } else {
          throw new Error('Sms Funtionality failed!.');
        }
      } else {
        return response;
      }
    } else {
      throw new Error('Failed to create reservation!.');
    }
  }

  async deleteReservation(id: number) {
    await this.reservationsRepository.delete(id);
    return id;
  }

  async updateReservation(id: number, reservation: ReservationsDto) {
    //TODO - Increate/decrease seats based on the reservation status.
    await this.reservationsRepository.update(id, reservation);
    return await this.reservationsRepository.findOne(id);
  }

  async updateReservationStatus(id: number, status: boolean) {
    await this.reservationsRepository.update(id, { confirmed: status });
    return await this.reservationsRepository.findOne(id);
  }

  async updatePaymentStatus(id: number, status: boolean) {
    await this.reservationsRepository.update(id, { payment_completed: status });
    return await this.reservationsRepository.findOne(id);
  }

  async findAll(): Promise<Reservations[]> {
    return await this.reservationsRepository.find({
      relations: ['tickets'],
    });
  }

  async findOneById(id: number) {
    return await this.reservationsRepository.findOne(id, {
      relations: ['tickets'],
    });
  }

  async findReservationsForEvent(id: number) {
    return await this.reservationsRepository.find({
      where: { event_id: id },
      relations: ['tickets'],
    });
  }

  async sendSmsToUser(reservation: ReservationsDto) {
    const event = await this.eventService.findOneById(reservation.event_id);
    const reservationMessage = await this.buildReservationMessage(event);
    return await this.smsService.sendMessageToUser(
      reservation.phone,
      reservation.name,
      reservationMessage,
    );
  }

  async buildReservationMessage(event: EventsDto) {
    const time = this.getTime(event.event_date);
    const date = this.getDate(event.event_date);
    const name = event.name;
    const location = event.location;
    const message = stringInterpolator(
      this.i18Service.getContents().reservations.confirmation,
      {
        name,
        location,
        date,
        time,
      },
    );
    return message;
  }

  async getTotalAmount(reservation: ReservationsDto) {
    const event = await this.eventService.findOneById(reservation.event_id);
    const total = await reservation.tickets.reduce((amount, ticket) => {
      amount =
        amount +
        Number(ticket.no_of_tickets) *
          Number(this.getTicketPrice(event.ticket_catalog, ticket.price_id));
      return amount;
    }, 0);

    return total;
  }

  getTicketPrice(ticket_catalog: PriceDto[], id: number): number {
    const response = ticket_catalog.find(ticket => ticket.id == id);
    return response.price;
  }

  async checkSeatAvailability(reservationReq: ReservationsDto) {
    const ticketDetails = await this.checkTicketDetails(reservationReq);
    const availableTickets = ticketDetails.filter(
      ticket => ticket.seats_available,
    );
    if (ticketDetails.length === availableTickets.length) {
      return true;
    } else {
      return false;
    }
  }

  async getSeatAvailabilityDetails(eventId: number) {
    const eventDetails = await this.eventService.findOneById(eventId);
  }

  async checkTicketDetails(reservationReq: ReservationsDto) {
    const reducedTickets = await Promise.all(
      reservationReq.tickets.map(async tickets => {
        const ticketDetails = await this.priceService.getPriceDetails(
          tickets.price_id,
        );
        const availability =
          ticketDetails.max_seats - ticketDetails.occupied_seats >=
          tickets.no_of_tickets;
        return {
          ...tickets,
          max_seats: ticketDetails.max_seats,
          occupied_seats: ticketDetails.occupied_seats,
          seats_available: availability,
        };
      }),
    );

    return reducedTickets;
  }

  getTime(date) {
    return format(date, this.i18Service.getContents().reservations.timeFormat);
  }

  getDate(date) {
    return format(date, this.i18Service.getContents().reservations.dateFormat);
  }
}
