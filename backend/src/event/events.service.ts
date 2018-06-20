import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from './events.entity';
import { EventsDto } from './events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventRepository: Repository<Events>,
  ) {}

  async createEvent(event: EventsDto) {
    const response = await this.eventRepository.save(event);
    return response;
  }

  async deleteEvent(id: number) {
    await this.eventRepository.delete(id);
    return id;
  }

  async updateEvent(id: number, event: EventsDto) {
    const response = await this.eventRepository.update(id, event);
    return response;
  }

  async findAll(): Promise<Events[]> {
    return await this.eventRepository.find();
  }

  async findOneById(id: number) {
    return await this.eventRepository.findOne(id);
  }
}
