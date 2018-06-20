import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservations } from './reservations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservations])],
  controllers: [ReservationsController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationsModule {}
