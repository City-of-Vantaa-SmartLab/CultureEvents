import { types } from 'mobx-state-tree';
import TicketCatalog from './ticketCatalog';
import { format } from 'date-fns';

const Event = types
  .model({
    id: types.identifier(types.union(types.string, types.number)),
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
    ageGroupLimits: types.optional(types.array(types.string), ['0-3']), // @TODO: change this to array once have backend support
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
  })
  .views(self => ({
    get totalAvailableTickets() {
      const result = self.ticketCatalog.reduce((acc, curr) => {
        acc += curr.maxSeats - curr.occupiedSeats;
        return acc;
      }, 0);
      console.log(result);
      return result;
    },
  }));
export default Event;
