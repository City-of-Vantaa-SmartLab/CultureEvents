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

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>,
    private readonly smsService: SMSService,
    private readonly i18Service: I18Service,
    private readonly eventService: EventsService,
  ) {}

  async createReservation(reservation: ReservationsDto) {
    const response = await this.reservationsRepository.save(reservation);
    if (response) {
      const smsResponse = this.sendSmsToUser(reservation);
      if (smsResponse) {
        return response;
      } else {
        return new Error('Sms Funtionality failed!.');
      }
    } else {
      return new Error('Failed to create reservation!.');
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

  async sendSmsToUser(reservation: ReservationsDto) {
    const event = await this.eventService.findOneById(reservation.event_id);
    const reservationMessage = await this.buildReservationMessage(event);
    await this.smsService.sendMessageToUser(
      reservation.phone_number,
      reservation.username,
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

  getTime(date) {
    return format(date, this.i18Service.getContents().reservations.timeFormat);
  }

  getDate(date) {
    return format(date, this.i18Service.getContents().reservations.dateFormat);
  }
}
