import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationService } from 'utils/validations/validations.service';
import { I18Service } from 'i18/i18.service';
import { Payments } from './payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BamboraService } from 'services/bambora.service';
import { ReservationService } from 'reservations/reservations.service';
import { Reservations } from 'reservations/reservations.entity';
import { SMSService } from 'notifications/sms/sms.service';
import { EventsService } from 'event/events.service';
import { ReservationsModule } from 'reservations/reservations.module';
import { EventsModule } from 'event/events.module';
import { PriceModule } from 'price/price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payments]),
    ReservationsModule,
    EventsModule,
    PriceModule
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    ValidationService,
    BamboraService,
    SMSService,
    I18Service,
  ],
  exports: [PaymentService],
})
export class PaymentModule { }
