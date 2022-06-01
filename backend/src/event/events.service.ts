import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from './events.entity';
import { EventsDto } from './events.dto';
import { PriceService } from '../price/price.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventRepository: Repository<Events>,
    private readonly priceService: PriceService,
  ) { }

  async createEvent(event: EventsDto) {
    const event_to_save = {
      ...event,
      age_group_limits: event.age_group_limits.join(','),
    };
    const response = await this.eventRepository.save(event_to_save);
    return this.mapSingleEventForAPI(response);
  }

  async deleteEvent(id: number) {
    const event = await this.eventRepository.findOne({where:{id}});
    if (!event) {
      return;
    }
    await this.eventRepository.delete(id);
    return id;
  }

  async updateEvent(id: number, event: EventsDto) {
    const dbEvent = await this.eventRepository.findOne({where:{id}});
    if (dbEvent) {
      const event_to_update = {
        ...dbEvent,
        ...event,
        age_group_limits: event.age_group_limits.join(','),
      };
      await this.eventRepository.update(id, event_to_update);
      if (event_to_update.ticket_catalog) {
          for (const price of event_to_update.ticket_catalog) {
            await this.priceService.updateOrCreatePrice(price, dbEvent);
          }
      }
      const updatedEvent = await this.eventRepository.findOne({where:{id},
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
    const event = await this.eventRepository.findOne({where: {id},
      relations: ['ticket_catalog'],
    });
    return this.mapSingleEventForAPI(event);
  }

  private mapEventsForAPI(events: Events[]) {
    return events.map(event => ({
      ...event,
      age_group_limits: event.age_group_limits.split(','),
    }));
  }

  private mapSingleEventForAPI(event: Events) {
    return {
      ...event,
      age_group_limits: event.age_group_limits.split(','),
    };
  }
}
