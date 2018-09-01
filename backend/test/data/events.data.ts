import * as dateFns from 'date-fns';
import { areas } from '../../src/data/areas';

export const newEvent = {
    name: 'New Event',
    location: 'Kamppi',
    description: 'test event',
    event_date: dateFns.format(new Date(), 'YYYY-MM-DD'),
    event_time: dateFns.format(new Date(), 'mm:dd'),
    ticket_catalog: [
        {
            price: 10,
            ticket_description: 'adults ticket',
            max_seats: 10,
            occupied_seats: 0
        },
        {
            price: 10,
            ticket_description: 'kids ticket',
            max_seats: 10,
            occupied_seats: 0
        }
    ],
    contact_information: 'test@test.com',
    event_type: 'kids',
    area: areas[0],
    age_group_limits: ['0-2'],
    is_wordless: true,
    is_bilingual: true,
    cover_image: 'sample_image.jpg',
    theme_color: 'red',
    performer: 'newbie'
}

export const updateEvent = {
    name: 'Updated Event',
    location: 'Vantaa',
    description: 'updated description',
    event_date: dateFns.format(new Date(), 'YYYY-MM-DD'),
    event_time: dateFns.format(new Date(), 'mm:dd'),
    ticket_catalog: [
        {
            price: 20,
            ticket_description: 'Updated adult ticket',
            max_seats: 10,
            occupied_seats: 0
        },
        {
            price: 10,
            ticket_description: 'kids ticket',
            max_seats: 10,
            occupied_seats: 0
        }
    ],
    contact_information: 'test@test.com',
    event_type: 'kids',
    area: areas[0],
    age_group_limits: ['0-2'],
    is_wordless: true,
    is_bilingual: true,
    cover_image: 'sample_image.jpg',
    theme_color: 'red',
    performer: 'newbie'
}