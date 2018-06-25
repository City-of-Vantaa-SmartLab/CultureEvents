import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservations } from './reservations.entity';
import { ReservationsDto } from './reservations.dto';
import { Price } from 'price/price.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>,
  ) {}

  async createReservation(reservation: ReservationsDto) {
    const response = await this.reservationsRepository.save(reservation);
    return response;
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
}
