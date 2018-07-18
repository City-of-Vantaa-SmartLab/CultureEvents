import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from 'price/price.entity';
import { PriceDto } from './price.dto';
@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  async getPriceDetails(id: number) {
    const priceDetails = await this.priceRepository.findOne(id);
    if (priceDetails) {
      return priceDetails;
    } else {
      throw new Error('Failed to get Price details!.');
    }
  }

  async updateSeatsBooked(id: number, seats_booked: number) {
    const priceDetails = await this.priceRepository.findOne(id);
    if (priceDetails) {
      priceDetails.occupied_seats = priceDetails.occupied_seats + seats_booked;
      await this.priceRepository.save(priceDetails);
      const updatedPriceDetails = await this.priceRepository.findOne(id);
      return updatedPriceDetails;
    } else {
      throw new Error('Failed to get Price details!.');
    }
  }
}
