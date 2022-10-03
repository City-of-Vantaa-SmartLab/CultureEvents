import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import 'jest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionDetails } from '../src/connection';
import { PriceModule } from '../src/price/price.module';
import { ValidationService } from '../src/utils/validations/validations.service';
import { Events } from '../src/event/events.entity';
import { Reservations } from '../src/reservations/reservations.entity';
import { newReservation } from './data/reservations.data';
import { ReservationsController } from '../src/reservations/reservations.controller';
import { SMSService } from '../src/notifications/sms/sms.service';
import { I18Service } from '../src/i18/i18.service';
import { newEvent } from './data/events.data';
import { EventsController } from '../src/event/events.controller';
import { Payments } from '../src/payments/payment.entity';
import { PaymentService } from '../src/payments/payment.service';
import { EventsModule } from '../src/event/events.module';
import { ReservationsModule } from '../src/reservations/reservations.module';
import { PaymentController } from '../src/payments/payment.controller';
import * as dateFns from 'date-fns';
import { Tickets } from '../src/tickets/tickets.entity';

describe('PaymentsController (e2e)', () => {
    let app: INestApplication;
    let createdReservation: Reservations;
    let updatedReservation: Reservations;
    let updatedReservationFromDb: Reservations;
    let createdEvent: Events;
    let paymentService: PaymentService;
    let httpServer: any;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            controllers: [PaymentController, ReservationsController,
                EventsController],
            imports: [
                TypeOrmModule.forRoot({ ...connectionDetails, dropSchema: true }),
                TypeOrmModule.forFeature([Events, Reservations, Payments, Tickets]),
                ReservationsModule,
                EventsModule,
                PriceModule,
            ],
            providers: [
                ValidationService,
                SMSService,
                I18Service,
                PaymentService,
                Logger]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(/^\/$/, (_, res) => {
            res.redirect('/app/');
        });
        await app.init();
        paymentService = app.get<PaymentService>(PaymentService);
        httpServer = await request(app.getHttpServer());
    });

    it('/POST / /api/events', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/events')
            .send(newEvent);
        expect(response.status).toBe(201);
        createdEvent = response.body;
        expect(response.body.name).toBe(createdEvent.name);
    });

    // Creates a failed payment request which also creates a reservation request.
    it('/POST / /api/payments/make-payment', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/payments/make-payment')
            .send(newReservation);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ "redirect_url": "https://payform.bambora.com/pbwapi/token/undefined" });
    });

    // Verifying whether reservation has been created with payemnt required as true.
    it('/GET /:id /api/reservations/1', async () => {
        const reservation = await request(app.getHttpServer())
            .get('/api/reservations/1');
        createdReservation = reservation.body;
        expect(createdReservation).toBeDefined();
        expect(createdReservation.payment_required).toBeTruthy();
        expect(createdReservation.payment_completed).toBeFalsy();
        expect(createdReservation.cancelled).toBeFalsy();
    });

    // Make sure that it does not return failed reservations.
    it('/GET /api/reservations', () => {
        return request(app.getHttpServer())
            .get('/api/reservations')
            .expect(200)
            .expect([]);
    });

    //Getting successful payment-return
    it('/GET /payment-return', async () => {
        const payment = await paymentService.getOne(1);
        const response = await request(app.getHttpServer())
            .get(`/api/payments/payment-return?` +
                `RETURN_CODE=0&ORDER_NUMBER=${payment.order_number}`);
        expect(response.status).toBe(302);
        expect(response.header['location'])
            .toBe(`/app/payment-complete?` +
                `orderNumber=${payment.order_number}&amount=${payment.amount}&status=5&event_id=1`);
        expect(response.body).toEqual({});
    });

    // Checking payment-return is not done twice
    it('/GET /payment-return', async () => {
        const payment = await paymentService.getOne(1);
        const response = await request(app.getHttpServer())
            .get(`/api/payments/payment-return?` +
                `RETURN_CODE=0&ORDER_NUMBER=${payment.order_number}`);
        expect(response.status).toBe(302);
        expect(response.header['location'])
            .toBe(`/app/payment-complete?status=2&event_id=1`);
        expect(response.body).toEqual({});
    });

    //Verifying the payment confirmation status for the reservation.
    it('/GET /:id /api/reservations/1', async () => {
        const reservation = await request(app.getHttpServer())
            .get('/api/reservations/1');
        createdReservation = reservation.body;
        expect(createdReservation).toBeDefined();
        expect(createdReservation.payment_required).toBeTruthy();
        expect(createdReservation.payment_completed).toBeTruthy();
        expect(createdReservation.cancelled).toBeFalsy();
    });

    //Making sure successful reservations are not deleted.
    it('/GET /api/reservations', async () => {
        const reservation = await request(app.getHttpServer())
            .get('/api/reservations');
        expect(reservation.status).toBe(200);
        expect(reservation.body).toEqual([{
            ...createdReservation,
            payment_completed: true, confirmed: true
        }]);
    });

    // To verify the deletion of the failed payments.
    // Updating the created date to be past 6 minutes
    it('/PUT /api/reservations/1', async () => {
        const reservation = await request(app.getHttpServer())
            .get('/api/reservations/1');
        expect(reservation.body).toBeDefined();
        expect(reservation.body.payment_required).toBeTruthy();
        expect(reservation.body.payment_completed).toBeTruthy();
        expect(reservation.body.cancelled).toBeFalsy();

        //Updated reservation payment not completed
        updatedReservation = {
            ...createdReservation,
            created: dateFns.format(dateFns.subMinutes(new Date(), 6), 'YYYY-MM-DD HH:mm'),
            payment_completed: false
        }
        const response = await request(app.getHttpServer())
            .put('/api/reservations/1')
            .send(updatedReservation);
        updatedReservationFromDb = response.body;
        updatedReservationFromDb.created
            = dateFns.format(updatedReservationFromDb.created, 'YYYY-MM-DD HH:mm')
        expect(updatedReservationFromDb).toEqual(updatedReservation);

    });

    //Checking whether reservation is still available.
    it('/GET /:id', async () => {
        const response = await httpServer
            .get('/api/reservations/1');
        updatedReservationFromDb = response.body;
        updatedReservationFromDb.created
            = dateFns.format(updatedReservationFromDb.created, 'YYYY-MM-DD HH:mm')
        expect(updatedReservationFromDb).toEqual(updatedReservation);
    });

    //Making sure that the failed reservation is deleted on the getAll call.
    it('/GET ', async () => {
        const reservation = await httpServer
            .get('/api/reservations');
        expect(reservation.status).toBe(200);
        expect(reservation.body).toEqual([]);
    });

    it('/GET /', () => {
        return request(app.getHttpServer())
            .get('/api/reservations')
            .expect(200)
            .expect([]);
    });

    it('/GET /:id', async () => {
        request(app.getHttpServer())
            .get('/api/reservations/1')
            .expect(404);
    });

    afterAll(async () => {
        await app.close();
    });
});
