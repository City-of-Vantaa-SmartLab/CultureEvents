import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Events } from './events.entity';
import { ValidationService } from 'utils/validations/validations.service';
import { ReservationsModule } from 'reservations/reservations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Events]), ReservationsModule],
  controllers: [EventsController],
  providers: [EventsService, ValidationService],
  exports: [EventsService],
})
export class EventsModule {}
