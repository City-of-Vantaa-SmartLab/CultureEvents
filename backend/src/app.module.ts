import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { EventsModule } from './event/events.module';
import { ReservationsModule } from 'reservations/reservations.module';

@Module({
  imports: [TypeOrmModule.forRoot(), EventsModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
    connection.synchronize(true);
  }
}
