import { types } from 'mobx-state-tree';
import TicketCatalog from './ticketCatalog';
import ReservationsAndOrder from './bookingsAndOrders';
import { format } from 'date-fns';

const Event = types
  .model({
    id: types.identifierNumber,
    name: types.optional(types.string, ''),
    location: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    performer: types.optional(types.string, ''),
    eventDate: types.optional(types.string, () =>
      format(new Date(), 'YYYY-MM-DD'),
    ),
    eventTime: types.optional(types.string, () => format(new Date(), 'HH:MM')),
    ticketCatalog: types.optional(types.array(TicketCatalog), [
      TicketCatalog.create().toJSON(),
    ]),
    contactInformation: types.optional(types.string, ''),
    eventType: types.optional(
      types.enumeration('EventType', [
        'Kurssit Ja Työpajat',
        'Näyttelyt',
        'Esitykset',
      ]),
      'Esitykset',
    ),
    ageGroupLimits: types.optional(types.array(types.string), ['0-3']),
    isWordless: types.optional(types.boolean, false),
    isBilingual: types.optional(types.boolean, false),
    coverImage: types.optional(types.string, ''),
    themeColor: types.optional(types.string, '#498DC7'),
    area: types.optional(
      types.enumeration('Area', [
        'Tikkurila',
        'Aviapolis',
        'Myyrmäki',
        'Korso',
        'Hakunila',
        'Koivukylä',
      ]),
      'Tikkurila',
    ),
    reservationsAndOrders: types.maybe(types.array(ReservationsAndOrder)),
  })
  .views(self => ({
    get totalAvailableTickets() {
      return self.ticketCatalog.reduce((acc, curr) => {
        acc += curr.maxSeats - curr.occupiedSeats;
        return acc;
      }, 0);
    },
  }));
export default Event;
