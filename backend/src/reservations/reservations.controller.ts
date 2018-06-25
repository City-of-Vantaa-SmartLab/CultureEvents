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
import { ValidationService } from '../utils/validations/validations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationService,
    private readonly validationService: ValidationService,
  ) {}
  @Get()
  async findAll(@Res() response): Promise<Reservations[]> {
    try {
      const reservations = await this.reservationsService.findAll();
      if (reservations) {
        return response.status(200).send(reservations);
      } else {
        return response
          .status(404)
          .send(`Could not find any reservations in the system.`);
      }
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
  @UsePipes(new ValidationPipe())
  async findOne(@Res() response, @Param('id') id: number) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).send(`Invalid reservation Id: ${id}`);
      } else {
        const reservation = await this.reservationsService.findOneById(id);
        if (reservation) {
          return response.status(200).send(reservation);
        } else {
          return response
            .status(404)
            .send(`Could not find any reservations with id: ${id}`);
        }
      }
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
    @Param('id') id: number,
    @Body() Reservation: ReservationsDto,
  ) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).send(`Invalid reservation Id: ${id}`);
      } else {
        const updatedReservation = await this.reservationsService.updateReservation(
          id,
          Reservation,
        );
        if (updatedReservation) {
          return response.status(200).send(updatedReservation);
        } else {
          return response
            .status(404)
            .send(`Could not find any reservations with id: ${id}`);
        }
      }
    } catch (error) {
      return response
        .status(500)
        .send(`Failed to update reservation: ${error.message}`);
    }
  }
}
