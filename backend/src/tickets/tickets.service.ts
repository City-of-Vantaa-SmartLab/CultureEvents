import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tickets } from './tickets.entity';
import { TicketsDto } from './tickets.dto';

@Injectable()
export class TicketService {
  constructor(@InjectRepository(Tickets) private readonly ticketsRepository: Repository<Tickets>) {}

  async getTicketDetails(id: number) {
    const response = await this.ticketsRepository.findOne({where:{id}});
    if (response) {
      return response;
    } else {
      throw new Error('Failed to get ticket details!.');
    }
  }

  async create(ticket: Tickets) {
    await this.ticketsRepository.save(ticket);
  }

  async delete(id: number) {
    await this.ticketsRepository.delete(id);
  }

  async update(id: number, ticket: TicketsDto) {
    const ticketFromDb = await this.ticketsRepository.findOne({where:{id}});
    const ticketToUpdate = {
      ...ticketFromDb,
      ...ticket,
    };
    await this.ticketsRepository.save(ticketToUpdate);
  }
}
