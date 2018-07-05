import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { EventsModule } from './event/events.module';
import { ReservationsModule } from 'reservations/reservations.module';
import { UserModule } from 'user/user.module';
import { AuthModule } from 'auth/auth.module';
import { PaymentModule } from 'payments/payment.module';
import { SeedModule } from 'seed-db/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EventsModule,
    ReservationsModule,
    UserModule,
    AuthModule,
    PaymentModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
