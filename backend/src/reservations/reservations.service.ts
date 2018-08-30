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
import { TicketService } from 'tickets/tickets.service';
import * as dateFns from 'date-fns';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>,
    private readonly smsService: SMSService,
    private readonly i18Service: I18Service,
    private readonly eventService: EventsService,
    private readonly priceService: PriceService,
    private readonly ticketService: TicketService
  ) { }

  async createReservation(reservation: ReservationsDto, sendSms: boolean) {
    const response = await this.reservationsRepository.save(reservation);
    if (response) {
      if (sendSms) {
        const smsResponse = await this.sendSmsToUser(reservation);
        if (smsResponse) {
          await this.updateReservation(reservation.id, { sms_sent: true })
        }
      }
      await Promise.all(
        reservation.tickets.map(
          ticket =>
            this.priceService.updateSeats(ticket.price_id, ticket.no_of_tickets),
        ),
      );
      return response;

    } else {
      throw new Error('Failed to create reservation!.');
    }
  }

  async deleteReservation(id: number) {
    const reservation = await this.findOneById(id);
    await Promise.all(
      reservation.tickets.map(
        async ticket => {
          await this.priceService.updateSeats(ticket.price_id, -ticket.no_of_tickets);
          await this.ticketService.delete(ticket.id);
        }
      ),
    );

    await this.reservationsRepository.delete(id);
    return id;
  }

  async updateReservation(id: number, reservation: Partial<ReservationsDto>) {
    const reservationFromDb = await this.findOneById(id);
    const reservationToUpdate = {
      ...reservationFromDb,
      ...reservation
    }
    await this.reservationsRepository.update(id, reservationToUpdate);
    return await this.reservationsRepository.findOne(id);
  }

  async findAll(): Promise<Reservations[]> {
    let failedReservations = await this.reservationsRepository.find({
      where: {
        payment_required: true,
        payment_completed: false,
      },
      relations: ['tickets'],
    });

    //Find failed reservations
    failedReservations = failedReservations.filter(reservation =>
      dateFns.differenceInMinutes(new Date(), reservation.created) > 5);

    //Delete failed reservations
    failedReservations.forEach(async reservation =>
      await this.deleteReservation(reservation.id))

    let reservations = await this.reservationsRepository.find({
      relations: ['tickets'],
    });

    reservations = reservations.filter(reservations => (
      (reservations.payment_completed && reservations.payment_required)
      || !reservations.payment_required)
    );

    return reservations;
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
    const reservationMessage = await this.buildReservationMessage(event, reservation);
    return await this.smsService.sendMessageToUser(
      reservation.phone,
      reservation.name,
      reservationMessage,
    );
  }

  async buildReservationMessage(event: EventsDto, reservation: ReservationsDto) {
    const time = event.event_time.replace(/:/g, '.')
    const date = this.getDate(event.event_date);
    const name = event.name;
    const location = event.location;
    let ticketDetails = await Promise.all(reservation.tickets.map(async ticket => {
      const priceDetails = await this.priceService.getPriceDetails(ticket.price_id);
      return (
        (`${priceDetails.ticket_description}  ${priceDetails.price} €  ${ticket.no_of_tickets} kpl `)
      )
    }));
    const ticketDetailString = ticketDetails.join('\n');
    const personName = reservation.name;
    const message = stringInterpolator(
      this.i18Service.getContents().reservations.confirmation,
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

  getDate(date) {
    return format(date, this.i18Service.getContents().reservations.dateFormat);
  }
}
