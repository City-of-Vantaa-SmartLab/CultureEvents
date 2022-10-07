import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Events } from './events.entity';
import { ReservationsModule } from '../reservations/reservations.module';
import { Reservations } from '../reservations/reservations.entity';
import { PriceModule } from '../price/price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Events]),
    TypeOrmModule.forFeature([Reservations]),
    ReservationsModule,
    PriceModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule { }
