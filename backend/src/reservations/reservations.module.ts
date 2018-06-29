import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservations } from './reservations.entity';
import { ValidationService } from 'utils/validations/validations.service';
import { SMSService } from 'notifications/sms/sms.service';
import { EventsService } from 'event/events.service';
import { Events } from '../event/events.entity';
import { I18Service } from 'i18/i18.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservations]),
    TypeOrmModule.forFeature([Events]),
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationService,
    ValidationService,
    SMSService,
    EventsService,
    I18Service,
  ],
  exports: [ReservationService],
})
export class ReservationsModule {}
