import { types } from 'mobx-state-tree';
import TicketCatalog from './ticketCatalog';
import { format } from 'date-fns';
import * as consts from 'const';

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
      types.enumeration('EventType', consts.eventType),
      'Esitykset',
    ),
    ageGroupLimits: types.optional(types.array(types.string), ['0-2']),
    isWordless: types.optional(types.boolean, false),
    isBilingual: types.optional(types.boolean, false),
    coverImage: types.optional(types.string, ''),
    themeColor: types.optional(types.string, '#498DC7'),
    area: types.optional(types.enumeration('Area', consts.area), 'Tikkurila'),
  })
  .views(self => ({
    get totalAvailableTickets() {
      return self.ticketCatalog.reduce((acc, curr) => {
        acc += curr.maxSeats - curr.occupiedSeats;
        return acc;
      }, 0);
    },
    catalogById(id) {
      return self.ticketCatalog.find(c => c.id === id);
    },
  }));
export default Event;
