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
  UseGuards,
  Delete,
} from '@nestjs/common';
import { EventsDto } from './events.dto';
import { EventsService } from './events.service';
import { ValidationPipe } from 'validations/validation.pipe';
import { Events } from './events.entity';
import { ValidationService } from '../utils/validations/validations.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { ReservationService } from 'reservations/reservations.service';

@ApiUseTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly validationService: ValidationService,
    private readonly reservationsService: ReservationService,
  ) {}
  @Get()
  async findAll(@Res() response): Promise<Events[]> {
    try {
      const events = await this.eventsService.findAll();
      if (events) {
        return response.status(200).json(events);
      } else {
        return response
          .status(404)
          .json(`Could not find any events in the system.`);
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to get events: ${error.message}`);
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async create(@Res() response, @Body() event: EventsDto) {
    try {
      const createdEvent = await this.eventsService.createEvent(event);
      return response.status(201).json(createdEvent);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to create event: ${error.message}`);
    }
  }

  @Get(':id')
  async findOne(@Res() response, @Param('id') id: number) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).json(`Invalid event Id: ${id}`);
      } else {
        const event = await this.eventsService.findOneById(id);
        if (event) {
          return response.status(200).json(event);
        } else {
          return response
            .status(404)
            .json(`Could not find any event with id: ${id}`);
        }
      }
    } catch (error) {
      return response.status(500).json(`Failed to get event with id: ${id}`);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async update(
    @Res() response,
    @Param('id') id: number,
    @Body() event: EventsDto,
  ) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).json(`Invalid event Id: ${id}`);
      } else {
        const updated = await this.eventsService.updateEvent(id, event);
        if (updated) {
          return response.status(200).json(updated);
        } else {
          return response
            .status(404)
            .json(`Could not find any event with id: ${id}`);
        }
      }
    } catch (error) {
      return response.status(500).json(`Failed to update event with id: ${id}`);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async delete(@Res() response, @Param('id') id: number) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).json(`Invalid event Id: ${id}`);
      } else {
        const deleted = await this.eventsService.deleteEvent(id);
        if (deleted) {
          return response.status(200).json(deleted);
        } else {
          return response
            .status(404)
            .json(`Could not find any event with id: ${id}`);
        }
      }
    } catch (error) {
      return response.status(500).json(`Failed to delete event with id: ${id}`);
    }
  }

  @Get('/:id/reservations')
  @ApiImplicitParam({
    name: 'id',
    required: true,
    description: 'Event Id, for which reservations needs to be fetched',
    type: String,
  })
  async getEventReservations(@Res() response, @Param('id') id: number) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).json(`Invalid event Id: ${id}`);
      } else {
        const reservations = await this.reservationsService.findReservationsForEvent(
          id,
        );
        if (reservations) {
          return response.status(200).json(reservations);
        } else {
          return response
            .status(404)
            .json(`Could not find any reservations for event with id: ${id}`);
        }
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to get any reservations for event with id: ${id}`);
    }
  }
}
