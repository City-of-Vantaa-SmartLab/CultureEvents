import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import 'jest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionDetails } from '../src/connection';
import { PriceModule } from '../src/price/price.module';
import { EventsService } from '../src/event/events.service';
import { ValidationService } from '../src/utils/validations/validations.service';
import { Events } from '../src/event/events.entity';
import { Reservations } from '../src/reservations/reservations.entity';
import { newReservation, updateReservation, nonUpdatableReservation } from './data/reservations.data';
import { ReservationsController } from '../src/reservations/reservations.controller';
import { Tickets } from '../src/tickets/tickets.entity';
import { ReservationService } from '../src/reservations/reservations.service';
import { SMSService } from '../src/notifications/sms/sms.service';
import { I18Service } from '../src/i18/i18.service';
import { TicketService } from '../src/tickets/tickets.service';
import { newEvent } from './data/events.data';
import { EventsController } from '../src/event/events.controller';
import * as dateFns from 'date-fns';
import { PriceService } from '../src/price/price.service';

describe('ReservationsController (e2e)', () => {
    let app: INestApplication;
    let createdReservation: Reservations;
    let priceService: PriceService;
    let createdEvent: Events;
    let updatedReservation: any;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            controllers: [ReservationsController, EventsController],
            imports: [
                TypeOrmModule.forRoot({ ...connectionDetails, dropSchema: true }),
                TypeOrmModule.forFeature([Events, Reservations, Tickets]),
                PriceModule,
            ],
            providers: [ReservationService,
                ValidationService,
                SMSService,
                EventsService,
                I18Service,
                TicketService,
                Logger
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(/^\/$/, (_, res) => {
            res.redirect('/app/');
        });
        priceService = app.get<PriceService>(PriceService);
        await app.init();
    });

    it('/POST /api/events', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/events')
            .send(newEvent);
        expect(response.status).toBe(201);
        createdEvent = response.body;
        expect(response.body.name).toBe(createdEvent.name);
    });

    it('/POST /api/reservations', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/reservations')
            .send(newReservation);
        expect(response.status).toBe(201);
        createdReservation = response.body;
        expect(response.body.name).toBe(newReservation.name);
    });

    it('/GET /api/reservations', () => {
        return request(app.getHttpServer())
            .get('/api/reservations')
            .expect(200)
            .expect([createdReservation]);
    });

    it('/GET /:id /api/reservations/1', () => {
        return request(app.getHttpServer())
            .get('/api/reservations/1')
            .expect(200)
            .expect(createdReservation);
    });

    it('/PUT /:id /api/reservations/1', async () => {
        const response = await request(app.getHttpServer())
            .put('/api/reservations/1')
            .send(updateReservation);
        updatedReservation = {
            ...createdReservation,
            tickets: updateReservation.tickets.map(ticket => ticket.id ? ticket : { ...ticket, id: 3 })
        }
        expect(response.status).toBe(200);

        expect(response.body).toEqual(updatedReservation);
    });

    // Confirm that the reservation is updated properly
    it('/GET /:id /api/reservations/1', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/reservations/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedReservation);
    });

    it('Confirm the number of tickets available after update', async () => {
        const priceDetails1 = await priceService.getPriceDetails(1);
        expect(priceDetails1.max_seats).toBe(10);
        expect(priceDetails1.occupied_seats).toBe(0);
        expect(priceDetails1.price).toBe(10);
        const priceDetails2 = await priceService.getPriceDetails(2);
        expect(priceDetails2.max_seats).toBe(10);
        expect(priceDetails2.occupied_seats).toBe(2);
        expect(priceDetails2.price).toBe(10);
        const priceDetails3 = await priceService.getPriceDetails(3);
        expect(priceDetails3.max_seats).toBe(5);
        expect(priceDetails3.occupied_seats).toBe(1);
        expect(priceDetails3.price).toBe(15);
    });

    // Making sure that reservation is not updatable
    // When trying to update with more tickets than available.
    it('/PUT /:id /api/reservations/1', async () => {
        const response = await request(app.getHttpServer())
            .put('/api/reservations/1')
            .send(nonUpdatableReservation);
        expect(response.status).toBe(401);
        expect(response.body).toEqual('This reservation is not updatable. Not enough seats!');
    });

    //Making sure ticket count and reservation has not changed after a failed reservation.
    it('Confirm the number of tickets available after update', async () => {
        const priceDetails1 = await priceService.getPriceDetails(1);
        expect(priceDetails1.max_seats).toBe(10);
        expect(priceDetails1.occupied_seats).toBe(0);
        expect(priceDetails1.price).toBe(10);
        const priceDetails2 = await priceService.getPriceDetails(2);
        expect(priceDetails2.max_seats).toBe(10);
        expect(priceDetails2.occupied_seats).toBe(2);
        expect(priceDetails2.price).toBe(10);
        const priceDetails3 = await priceService.getPriceDetails(3);
        expect(priceDetails3.max_seats).toBe(5);
        expect(priceDetails3.occupied_seats).toBe(1);
        expect(priceDetails3.price).toBe(15);
    });

    // Making sure that the failed reservation has not changes any reservation data.
    it('/GET /:id /api/reservations/1', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/reservations/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedReservation);
    });

    it('/POST mark-complete /:id', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/reservations/1/mark-complete');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ...updatedReservation, payment_completed: true });
    });

    afterAll(async () => {
        await app.close();
    });
});
