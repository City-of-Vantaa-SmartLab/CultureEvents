import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Param,
  Body,
  UsePipes,
  Res,
} from '@nestjs/common';
import { EventsDto } from './events.dto';
import { EventsService } from './events.service';
import { ValidationPipe } from 'validations/validation.pipe';
import { Events } from './events.entity';
import { ValidationService } from '../utils/validations/validations.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly validationService: ValidationService,
  ) {}
  @Get()
  async findAll(@Res() response): Promise<Events[]> {
    try {
      const events = await this.eventsService.findAll();
      if (events) {
        return response.status(200).send(events);
      } else {
        return response
          .status(404)
          .send(`Could not find any events in the system.`);
      }
    } catch (error) {
      return response
        .status(500)
        .send(`Failed to get events: ${error.message}`);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Res() response, @Body() event: EventsDto) {
    try {
      const createdEvent = await this.eventsService.createEvent(event);
      return response.status(201).send(createdEvent);
    } catch (error) {
      return response
        .status(500)
        .send(`Failed to create event: ${error.message}`);
    }
  }

  @Get(':id')
  async findOne(@Res() response, @Param('id') id: number) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).send(`Invalid event Id: ${id}`);
      } else {
        const event = await this.eventsService.findOneById(id);
        if (event) {
          return response.status(200).send(event);
        } else {
          return response
            .status(404)
            .send(`Could not find any event with id: ${id}`);
        }
      }
    } catch (error) {
      return response.status(500).send(`Failed to get event with id: ${id}`);
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Res() response,
    @Param('id') id: number,
    @Body() event: EventsDto,
  ) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).send(`Invalid event Id: ${id}`);
      } else {
        const updated = await this.eventsService.updateEvent(id, event);
        if (updated) {
          return response.status(200).send(updated);
        } else {
          return response
            .status(404)
            .send(`Could not find any event with id: ${id}`);
        }
      }
    } catch (error) {
      return response.status(500).send(`Failed to update event with id: ${id}`);
    }
  }
}
