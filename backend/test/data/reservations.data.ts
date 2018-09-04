import * as dateFns from 'date-fns';
export const newReservation = {
    event_id: 1,
    customer_type: 'private',
    name: 'Test User',
    school_name: 'Test school name',
    class: 'test class name',
    phone: '1234',
    email: 'testuser@test.com',
    tickets: [
        {
            price_id: 1,
            no_of_tickets: 1
        },
        {
            price_id: 2,
            no_of_tickets: 1
        }
    ],
    confirmed: false,
    sms_sent: false,
    cancelled: false,
    payment_completed: false,
    payment_required: false
}

export const updateReservation = {
    id: 1,
    event_id: 1,
    customer_type: 'private',
    name: 'Updated User',
    school_name: 'Updated school name',
    class: 'test class name',
    phone: '1234',
    email: 'testuser@test.com',
    tickets: [
        {
            id: 1,
            price_id: 1,
            no_of_tickets: 0
        },
        {
            id: 2,
            price_id: 2,
            no_of_tickets: 2
        },
        {
            price_id: 3,
            no_of_tickets: 1
        }
    ],
    confirmed: false,
    sms_sent: false,
    cancelled: false,
    payment_completed: false,
    payment_required: false,
    created: dateFns.format(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS')
}

export const nonUpdatableReservation = {
    id: 1,
    event_id: 1,
    customer_type: 'private',
    name: 'Non Updatable User',
    school_name: 'Non Updatable school name',
    class: 'test class name',
    phone: '1234',
    email: 'testuser@test.com',
    tickets: [
        {
            id: 1,
            price_id: 1,
            no_of_tickets: 0
        },
        {
            id: 2,
            price_id: 2,
            no_of_tickets: 11
        },
    ],
    confirmed: false,
    sms_sent: false,
    cancelled: false,
    payment_completed: false,
    payment_required: false,
    created: dateFns.format(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS')
}