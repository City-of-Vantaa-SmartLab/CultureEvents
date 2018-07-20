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
import { ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';

@ApiUseTags('reservations')
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
        return response.status(200).json(reservations);
      } else {
        return response
          .status(404)
          .json(`Could not find any reservations in the system.`);
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to get reservations: ${error.message}`);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Res() response, @Body() reservation: ReservationsDto) {
    try {
      const seatsAvailable = await this.reservationsService.checkSeatAvailability(
        reservation,
      );
      if (!seatsAvailable) {
        return response
          .status(422)
          .json(`There are not enough seats available for this event`);
      }
      const reservationDto = await this.reservationsService.createReservation(
        reservation,
        true,
      );
      return response.status(201).json(reservation);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to create new reservation: ${error.message}`);
    }
  }

  @Post('/mark-complete')
  @UsePipes(new ValidationPipe())
  async mark_complete(@Res() response, @Body() id: number) {
    try {
      const reservation = await this.reservationsService.updatePaymentStatus(
        id,
        true,
      );
      if (!reservation.payment_completed) {
        return response
          .status(422)
          .json(`Failed to update reservation as completed`);
      }
      return response.status(201).json(reservation);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to update reservation as completed : ${error.message}`);
    }
  }

  @Get(':id')
  @ApiImplicitParam({
    name: 'id',
    required: true,
    description:
      'Reservation Id, of the reservations which needs to be fetched',
    type: String,
  })
  @UsePipes(new ValidationPipe())
  async findOne(@Res() response, @Param('id') id: number) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).json(`Invalid reservation Id: ${id}`);
      } else {
        const reservation = await this.reservationsService.findOneById(id);
        if (reservation) {
          return response.status(200).json(reservation);
        } else {
          return response
            .status(404)
            .json(`Could not find any reservations with id: ${id}`);
        }
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to get reservation: ${error.message}`);
    }
  }

  @Put(':id')
  @ApiImplicitParam({
    name: 'id',
    required: true,
    description:
      'Reservation Id, of the reservations which needs to be updated',
    type: String,
  })
  @UsePipes(new ValidationPipe())
  async update(
    @Res() response,
    @Param('id') id: number,
    @Body() Reservation: ReservationsDto,
  ) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).json(`Invalid reservation Id: ${id}`);
      } else {
        const updatedReservation = await this.reservationsService.updateReservation(
          id,
          Reservation,
        );
        if (updatedReservation) {
          return response.status(200).json(updatedReservation);
        } else {
          return response
            .status(404)
            .json(`Could not find any reservations with id: ${id}`);
        }
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to update reservation: ${error.message}`);
    }
  }
}
