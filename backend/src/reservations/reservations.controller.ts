import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UsePipes,
  Res,
  Delete,
  UseGuards,
  Logger
} from '@nestjs/common';
import { ReservationsDto } from './reservations.dto';
import { ReservationService } from './reservations.service';
import { ValidationPipe } from '../validations/validation.pipe';
import { Reservations } from './reservations.entity';
import { ValidationService } from '../utils/validations/validations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationService,
    private readonly validationService: ValidationService,
    private readonly logger: Logger
  ) {
    this.logger = new Logger('ReservationController');
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
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
      this.logger.error(error);
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
      return response.status(201).json(reservationDto);
    } catch (error) {
      this.logger.error(error);
      return response
        .status(500)
        .json(`Failed to create new reservation: ${error.message}`);
    }
  }

  // NB/TODO: is this unused code?
  @Post('/:id/mark-complete')
  @UsePipes(new ValidationPipe())
  async mark_complete(@Res() response, @Param() id: number) {
    try {
      const reservation = await this.reservationsService.updateReservation(id, { payment_completed: true });
      if (!reservation.payment_completed) {
        return response
          .status(422)
          .json(`Failed to update reservation as completed`);
      }
      return response.status(200).json(reservation);
    } catch (error) {
      this.logger.error(error);
      return response
        .status(500)
        .json(`Failed to update reservation as completed : ${error.message}`);
    }
  }

  @Get(':id')
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
      this.logger.error(error);
      return response
        .status(500)
        .json(`Failed to get reservation: ${error.message}`);
    }
  }

  // This is called when updating reservations via admin view.
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Res() response,
    @Param('id') id: number,
    @Body() reservation: Partial<ReservationsDto>,
  ) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).json(`Invalid reservation Id: ${id}`);
      }

      const isUpdatable = await this.reservationsService.isReservationUpdatable(reservation);
      if (!isUpdatable) {
        return response
          .status(401)
          .json(`This reservation is not updatable. Not enough seats!`);
      }

      const updatedReservation = await this.reservationsService.updateReservation(
        id,
        reservation,
      );

      if (!updatedReservation) {
        return response
          .status(404)
          .json(`Could not find any reservations with id: ${id}`);

      }
      return response.status(200).json(updatedReservation);

    } catch (error) {
      this.logger.error(error);
      return response
        .status(500)
        .json(`Failed to update reservation: ${error.message}`);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async delete(@Res() response, @Param('id') id: number) {
    try {
      if (this.validationService.validateId(+id)) {
        return response.status(400).json(`Invalid reservation Id: ${id}`);
      }
      const deletedReservation = await this.reservationsService.deleteReservation(id);

      if (!deletedReservation) {
        return response
          .status(404)
          .json(`Could not find any reservations with id: ${id}`);
      }

      return response.status(200).json(deletedReservation);

    } catch (error) {
      this.logger.error(error);
      return response
        .status(500)
        .json(`Failed to delete reservation: ${error.message}`);
    }
  }
}
