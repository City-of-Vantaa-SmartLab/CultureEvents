import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './event/events.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payments/payment.module';
import { SeedModule } from './seed-db/seed.module';
import { FileUploadModule } from './fileupload/fileupload.module';
import { FrontendMiddleware } from './middleware/frontend.middleware';
import { connectionDetails } from '../src/connection';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionDetails),
    EventsModule,
    ReservationsModule,
    UserModule,
    AuthModule,
    SeedModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(FrontendMiddleware).forRoutes('/**');
  }
}
