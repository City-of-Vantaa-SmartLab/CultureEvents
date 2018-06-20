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
import { ReservationsDto } from './reservations.dto';
import { ReservationService } from './reservations.service';
import { ValidationPipe } from 'validations/validation.pipe';
import { Reservations } from './reservations.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationService) {}
  @Get()
  async findAll(@Res() response): Promise<Reservations[]> {
    try {
      const reservations = await this.reservationsService.findAll();
      return response.status(200).send(reservations);
    } catch (error) {
      return response
        .status(500)
        .send(`Failed to get reservations: ${error.message}`);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Res() response, @Body() reservation: ReservationsDto) {
    try {
      const reservationDto = await this.reservationsService.createReservation(
        reservation,
      );
      return response.status(201).send(reservation);
    } catch (error) {
      return response
        .status(500)
        .send(`Failed to create new reservation: ${error.message}`);
    }
  }

  @Get(':id')
  async findOne(@Res() response, @Param('id') id) {
    try {
      const reservation = await this.reservationsService.findOneById(id);
      return response.status(200).send(reservation);
    } catch (error) {
      return response
        .status(500)
        .send(`Failed to get reservation: ${error.message}`);
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Res() response,
    @Param('id') id,
    @Body() Reservation: ReservationsDto,
  ) {
    try {
      const updatedReservation = await this.reservationsService.updateReservation(
        id,
        Reservation,
      );
      return response.status(200).send(updatedReservation);
    } catch (error) {
      return response
        .status(500)
        .send(`Failed to update reservation: ${error.message}`);
    }
  }
}
