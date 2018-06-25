import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservations } from './reservations.entity';
import { ValidationService } from 'utils/validations/validations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservations])],
  controllers: [ReservationsController],
  providers: [ReservationService, ValidationService],
  exports: [ReservationService],
})
export class ReservationsModule {}
