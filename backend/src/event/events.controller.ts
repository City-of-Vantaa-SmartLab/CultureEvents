import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Param,
  Body,
  UsePipes,
} from '@nestjs/common';
import { EventsDto } from './events.dto';
import { EventsService } from './events.service';
import { ValidationPipe } from 'validations/validation.pipe';
import { Events } from './events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Get()
  async findAll(): Promise<Events[]> {
    return this.eventsService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() event: EventsDto) {
    return this.eventsService.createEvent(event);
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.eventsService.findOneById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id, @Body() event: EventsDto) {
    return this.eventsService.updateEvent(id, event);
  }
}
