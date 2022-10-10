import { Module, Logger } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservations } from './reservations.entity';
import { SMSService } from '../notifications/sms/sms.service';
import { EventsService } from '../event/events.service';
import { Events } from '../event/events.entity';
import { I18Service } from '../i18/i18.service';
import { TicketService } from '../tickets/tickets.service';
import { Tickets } from '../tickets/tickets.entity';
import { PriceModule } from '../price/price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservations, Events, Tickets]),
    PriceModule,
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationService,
    SMSService,
    EventsService,
    I18Service,
    TicketService,
    Logger
  ],
  exports: [ReservationService],
})
export class ReservationsModule { }
