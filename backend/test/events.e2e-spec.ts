import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import 'jest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionDetails } from '../src/connection';
import { ReservationsModule } from '../src/reservations/reservations.module';
import { PriceModule } from '../src/price/price.module';
import { EventsService } from '../src/event/events.service';
import { ValidationService } from '../src/utils/validations/validations.service';
import { EventsController } from '../src/event/events.controller';
import { Events } from '../src/event/events.entity';
import { Reservations } from '../src/reservations/reservations.entity';
import { newEvent, updateEvent } from './data/events.data';
import { Price } from '../src/price/price.entity';
import { ReservationsController } from '../src/reservations/reservations.controller';
import { newReservation } from './data/reservations.data';

describe('EventsController (e2e)', () => {
    let app: INestApplication;
    let createdEvent: Events;
    let updatedEvent: Events;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            controllers: [EventsController, ReservationsController],
            imports: [
                TypeOrmModule.forRoot({ ...connectionDetails, dropSchema: true }),
                TypeOrmModule.forFeature([Events, Reservations, Price]),
                ReservationsModule,
                PriceModule
            ],
            providers: [EventsService, ValidationService]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(/^\/$/, (_, res) => {
            res.redirect('/app/');
        });
        await app.init();
    });

    it('/GET /', async () => {
        return await request(app.getHttpServer())
            .get('/api/events')
            .expect(200)
            .expect([]);
    });

    it('/POST /', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/events')
            .send(newEvent);
        expect(response.status).toBe(201);
        createdEvent = response.body;
        expect(response.body.name).toBe(newEvent.name);
    });

    it('/GET /', async () => {
        return await request(app.getHttpServer())
            .get('/api/events')
            .expect(200)
            .expect([createdEvent]);
    });

    it('/GET /:id', async () => {
        return await request(app.getHttpServer())
            .get('/api/events/1')
            .expect(200)
            .expect(createdEvent);
    });

    it('/PUT /:id', async () => {
        updatedEvent = {
            ...createdEvent,
            name: updateEvent.name,
            location: updateEvent.location,
            description: updateEvent.description
        }
        const response = await request(app.getHttpServer())
            .put('/api/events/1')
            .send(updateEvent);
        expect(response.body).toEqual(updatedEvent);
    });

    it('/GET /:id', async () => {
        return await request(app.getHttpServer())
            .get('/api/events/1')
            .expect(200)
            .expect(updatedEvent);
    });

    // Create a reservation for the event
    it('/POST /', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/reservations')
            .send(newReservation);
        expect(response.status).toBe(201);
        expect(response.body.event_id).toEqual(1);
    });

    // Events having reservation should not be able to be deleted
    it('/DELETE /:id', async () => {
        const response = await request(app.getHttpServer())
            .delete('/api/events/1');
        expect(response.status).toBe(401);
        expect(response.body).toEqual('You cannot delete an event having reservations!');
    });

    // Delete the reservation for the event
    it('/DELETE /reserations/:id', async () => {
        const response = await request(app.getHttpServer())
            .delete('/api/reservations/1')
        expect(response.status).toBe(200);
        expect(response.body).toEqual('1');
    });

    // Make sure delete is working fine now since there are no reservations for the event.
    it('/DELETE /events/:id', async () => {
        return await request(app.getHttpServer())
            .delete('/api/events/1')
            .expect(200)
            .expect(JSON.stringify("1"));
    });

    // Making sure that the event is deleted
    it('/GET /events', async () => {
        return await request(app.getHttpServer())
            .get('/api/events')
            .expect(200)
            .expect([]);
    });

    afterAll(async () => {
        await app.close();
    });
});
