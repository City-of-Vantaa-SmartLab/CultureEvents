import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from './events.entity';
import { EventsDto } from './events.dto';
import { Price } from 'price/price.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventRepository: Repository<Events>,
  ) {}

  async createEvent(event: EventsDto) {
    const event_to_save = {
      ...event,
      age_group_limit: event.age_group_limit.join(','),
    };
    const response = await this.eventRepository.save(event_to_save);
    return this.mapSingleEventForAPI(response);
  }

  async deleteEvent(id: number) {
    await this.eventRepository.delete(id);
    return id;
  }

  async updateEvent(id: number, event: EventsDto) {
    const dbEvent = await this.eventRepository.findOne(id);
    if (dbEvent) {
      const event_to_update = {
        ...event,
        age_group_limit: event.age_group_limit.join(','),
      };
      await this.eventRepository.update(id, event_to_update);
      const updatedEvent = await this.eventRepository.findOne(id, {
        relations: ['ticket_catalog'],
      });
      return this.mapSingleEventForAPI(updatedEvent);
    } else {
      return null;
    }
  }

  async findAll(): Promise<EventsDto[]> {
    const events = await this.eventRepository.find({
      relations: ['ticket_catalog'],
    });
    return this.mapEventsForAPI(events);
  }

  async findOneById(id: number) {
    const event = await this.eventRepository.findOne(id, {
      relations: ['ticket_catalog'],
    });
    return this.mapSingleEventForAPI(event);
  }

  private mapEventsForAPI(events: Events[]) {
    return events.map(event => ({
      ...event,
      age_group_limit: event.age_group_limit.split(','),
    }));
  }

  private mapSingleEventForAPI(event: Events) {
    return {
      ...event,
      age_group_limit: event.age_group_limit.split(','),
    };
  }
}
