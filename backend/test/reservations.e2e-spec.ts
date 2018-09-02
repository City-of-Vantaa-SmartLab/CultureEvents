import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import 'jest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionDetails } from '../src/connection';
import { PriceModule } from '../src/price/price.module';
import { EventsService } from '../src/event/events.service';
import { ValidationService } from '../src/utils/validations/validations.service';
import { Events } from '../src/event/events.entity';
import { Reservations } from '../src/reservations/reservations.entity';
import { newReservation, updateReservation } from './data/reservations.data';
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

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            controllers: [ReservationsController, EventsController],
            imports: [
                TypeOrmModule.forRoot({ ...connectionDetails, dropSchema: true }),
                TypeOrmModule.forFeature([Events, Reservations, Tickets]),
                PriceModule
            ],
            providers: [ReservationService,
                ValidationService,
                SMSService,
                EventsService,
                I18Service,
                TicketService,
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

    it('Confirm the number of tickets available', async () => {
        const ticketDetails1 = await priceService.getPriceDetails(1);
        expect(ticketDetails1.max_seats).toBe(10);
        expect(ticketDetails1.occupied_seats).toBe(1);
        expect(ticketDetails1.price).toBe(10);
        const ticketDetails2 = await priceService.getPriceDetails(2);
        expect(ticketDetails2.max_seats).toBe(10);
        expect(ticketDetails2.occupied_seats).toBe(1);
        expect(ticketDetails2.price).toBe(10);
    });

    it('/PUT /:id /api/reservations/1', async () => {
        const response = await request(app.getHttpServer())
            .put('/api/reservations/1')
            .send(updateReservation);
        expect(response.status).toBe(200);
        expect({
            ...response.body,
            created: dateFns.format(response.body.created, 'YYYY-MM-DDTHH:mm:ss.SSS')
        }).toEqual(updateReservation);
    });

    it('Confirm the number of tickets available after update', async () => {
        const ticketDetails1 = await priceService.getPriceDetails(1);
        expect(ticketDetails1.max_seats).toBe(10);
        expect(ticketDetails1.occupied_seats).toBe(2);
        expect(ticketDetails1.price).toBe(10);
        const ticketDetails2 = await priceService.getPriceDetails(2);
        expect(ticketDetails2.max_seats).toBe(10);
        expect(ticketDetails2.occupied_seats).toBe(0);
        expect(ticketDetails2.price).toBe(10);
    });

    // Confirm that the reservation is updated properly
    it('/GET /:id /api/reservations/1', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/reservations/1');
        expect(response.status).toBe(200);
        expect({
            ...response.body,
            created: dateFns.format(response.body.created, 'YYYY-MM-DDTHH:mm:ss.SSS')
        }).toEqual(updateReservation);
    });

    it('/POST mark-complete /:id', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/reservations/1/mark-complete');
        expect(response.status).toBe(200);
        expect({
            ...response.body,
            created: dateFns.format(response.body.created, 'YYYY-MM-DDTHH:mm:ss.SSS')
        }).toEqual({ ...updateReservation, payment_completed: true });
    });

    afterAll(async () => {
        await app.close();
    });
});
