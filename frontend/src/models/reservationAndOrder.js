import { types } from 'mobx-state-tree';
import EventModel from './event';

const ReservationAndOrder = types.model({
  id: types.identifierNumber,
  eventId: types.reference(types.late(() => EventModel)), // @TODO: Think of a way to make a collection of reservations as a field in event id
  name: types.string,
  class: types.string,
  schoolName: types.string,
  email: types.string,
  phone: types.string,
  confirmed: types.boolean,
  paymentCompleted: types.boolean,
  tickets: types.array(
    types.model('TicketCount', {
      priceId: types.identifierNumber,
      noOfTickets: types.number,
    }),
  ),
});

export default ReservationAndOrder;
