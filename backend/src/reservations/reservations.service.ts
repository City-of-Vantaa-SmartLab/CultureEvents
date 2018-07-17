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

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>,
    private readonly smsService: SMSService,
    private readonly i18Service: I18Service,
    private readonly eventService: EventsService,
  ) {}

  async createReservation(reservation: ReservationsDto, sendSms: boolean) {
    const response = await this.reservationsRepository.save(reservation);
    if (response) {
      if (sendSms) {
        const smsResponse = this.sendSmsToUser(reservation);
        if (smsResponse) {
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
    const response = await this.reservationsRepository.update(id, reservation);
    return response;
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
    await this.smsService.sendMessageToUser(
      reservation.phone,
      reservation.name,
      reservationMessage,
    );
  }

  async buildReservationMessage(event: EventsDto) {
    const response = ` Event: ${event.name} 
    <br> Premises: ${event.location} 
    <br> Date: ${this.getDate(event.event_date)} 
    <br> Time: ${this.getTime(event.event_date)} 
    <br> Name of the Reservation: ${event.name}`;
    return response;
  }

  async getTotalAmount(reservation: ReservationsDto) {
    const event = await this.eventService.findOneById(reservation.event_id);
    const amount = reservation.tickets.map(tickets => {
      return (
        tickets.no_of_tickets *
        this.getTicketPrice(event.ticket_catalog, tickets.price_id)
      );
    });
    return amount;
  }

  getTicketPrice(ticket_catalog: PriceDto[], id: number): number {
    const response = ticket_catalog.find(ticket => ticket.id == id);
    return response.price;
  }

  async checkSeatAvailability(reservation: ReservationsDto) {
    const remaining_tickets = await this.getRemainingTicketsForAnEvent(
      reservation.event_id,
    );
    const notEnoughSeatsAvailable = await reservation.tickets.map(tickets => {
      if (remaining_tickets[tickets.price_id] < tickets.no_of_tickets) {
        return true;
      }
    });
    return notEnoughSeatsAvailable;
  }

  async getRemainingTicketsForAnEvent(event_id: number) {
    const eventDetails = await this.eventService.findOneById(event_id);

    const total_tickets_available = await eventDetails.ticket_catalog.reduce(
      (obj, mapTickets) => {
        obj[mapTickets.id] = obj[mapTickets.id] || [];
        obj[mapTickets.id] = mapTickets.available_seat_for_this_type;
        return obj;
      },
      {},
    );
    const reservationsForEvent = await this.findReservationsForEvent(event_id);

    const mapTickets = reservationsForEvent.map(reservation => {
      return { ...reservation.tickets };
    });
    const remaining_tickets = await mapTickets.reduce((obj, mapTickets) => {
      const ticketAvailable = total_tickets_available[mapTickets[0].price_id];
      obj[mapTickets[0].price_id] = obj[mapTickets[0].price_id] || [];
      if (Number(obj[mapTickets[0].price_id]) == 0) {
        obj[mapTickets[0].price_id] =
          ticketAvailable - mapTickets[0].no_of_tickets;
      } else {
        obj[mapTickets[0].price_id] =
          Number(obj[mapTickets[0].price_id]) - mapTickets[0].no_of_tickets;
      }
      return obj;
    }, {});
    return remaining_tickets;
  }

  getTime(date) {
    return format(date, this.i18Service.getContents().reservations.timeFormat);
  }

  getDate(date) {
    return format(date, this.i18Service.getContents().reservations.dateFormat);
  }
}
