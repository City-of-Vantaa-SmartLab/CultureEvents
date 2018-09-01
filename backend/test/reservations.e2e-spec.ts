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

describe('ReservationsController (e2e)', () => {
    let app: INestApplication;
    let createdReservation: Reservations;
    let updatedReservation: Reservations;
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
        await app.init();
    });

    it('/POST /', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/events')
            .send(newEvent);
        expect(response.status).toBe(201);
        createdEvent = response.body;
        expect(response.body.name).toBe(createdEvent.name);
    });

    it('/POST /', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/reservations')
            .send(newReservation);
        expect(response.status).toBe(201);
        createdReservation = response.body;
        expect(response.body.name).toBe(newReservation.name);
    });

    it('/GET /', () => {
        return request(app.getHttpServer())
            .get('/api/reservations')
            .expect(200)
            .expect([createdReservation]);
    });

    it('/GET /:id', () => {
        return request(app.getHttpServer())
            .get('/api/reservations/1')
            .expect(200)
            .expect(createdReservation);
    });

    it('/PUT /:id', async () => {
        updatedReservation = {
            ...createdReservation,
            name: updateReservation.name,
            school_name: updateReservation.school_name
        }
        const response = await request(app.getHttpServer())
            .put('/api/reservations/1')
            .send(updatedReservation);
        expect(response.body).toEqual(updatedReservation);
    });

    it('/GET /:id', () => {
        return request(app.getHttpServer())
            .get('/api/reservations/1')
            .expect(200)
            .expect(updatedReservation);
    });

    it('/POST mark-complete /:id', async () => {
        return await request(app.getHttpServer())
            .post('/api/reservations/1/mark-complete')
            .expect(200)
            .expect({ ...updatedReservation, payment_completed: true });
    });

    afterAll(async () => {
        await app.close();
    });
});
