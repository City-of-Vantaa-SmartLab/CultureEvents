import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tickets } from './tickets.entity';
@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Tickets)
    private readonly ticketsRepository: Repository<Tickets>,
  ) {}

  async getTicketDetails(id: number) {
    const response = await this.ticketsRepository.findOne(id);
    if (response) {
      return response;
    } else {
      throw new Error('Failed to get ticket details!.');
    }
  }
}
