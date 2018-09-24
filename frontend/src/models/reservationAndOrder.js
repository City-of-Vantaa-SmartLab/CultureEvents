import { types } from 'mobx-state-tree';
import EventModel from './event';

const ReservationAndOrder = types.model({
  id: types.identifierNumber,
  eventId: types.number,
  name: types.string,
  class: types.maybeNull(types.string),
  schoolName: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  phone: types.string,
  confirmed: types.boolean,
  paymentCompleted: types.boolean,
  tickets: types.array(
    types.model('TicketCount', {
      id: types.number,
      priceId: types.identifierNumber,
      noOfTickets: types.number,
    }),
  ),
});

export default ReservationAndOrder;
