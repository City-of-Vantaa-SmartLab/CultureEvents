import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './price.entity';
import { TicketsDto } from 'tickets/tickets.dto';
import { Tickets } from 'tickets/tickets.entity';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) { }

  async getPriceDetails(id: number) {
    const priceDetails = await this.priceRepository.findOne(id);
    if (priceDetails) {
      return priceDetails;
    } else {
      throw new Error('Failed to get Price details!.');
    }
  }

  async deletePrice(id: number) {
    await this.priceRepository.delete(id);
  }

  async updateSeats(id: number, seats_booked: number) {
    const priceDetails = await this.priceRepository.findOne(id);
    if (priceDetails) {
      priceDetails.occupied_seats = priceDetails.occupied_seats + seats_booked;
      if (priceDetails.occupied_seats > priceDetails.max_seats) {
        throw new Error('Not enough tickets available!.');
      }
      await this.priceRepository.save(priceDetails);
    } else {
      throw new Error('Failed to get Price details!.');
    }
  }

  async isSeatsAvailable(id: number, seats_booked: number) {
    const priceDetails = await this.priceRepository.findOne(id);
    if (priceDetails) {
      priceDetails.occupied_seats = priceDetails.occupied_seats + seats_booked;
      if (priceDetails.occupied_seats > priceDetails.max_seats) {
        return false;
      }
    } else {
      throw new Error('Failed to get Price details!.');
    }
    return true;
  }

  async isSeatsUpdatable(ticket: TicketsDto, ticketFromDb: Tickets) {
    const priceDetails = await this.priceRepository.findOne(ticket.price_id);
    if (priceDetails) {
      priceDetails.occupied_seats = priceDetails.occupied_seats + (ticket.no_of_tickets - ticketFromDb.no_of_tickets);
      if (priceDetails.occupied_seats > priceDetails.max_seats) {
        return false;
      }
    } else {
      throw new Error('Failed to get Price details!.');
    }
    return true;
  }
}
