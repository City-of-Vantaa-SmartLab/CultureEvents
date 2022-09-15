import { types } from 'mobx-state-tree';

const TicketCatalog = types
  .model({
    id: types.optional(types.identifierNumber, 989898),
    ticketDescription: types.optional(types.string, 'Single Ticket'),
    price: types.optional(types.refinement(types.number, value => !isNaN(Number(value)) && Number(value) >= 0), 0),
    maxSeats: types.optional(types.refinement(types.number, value => !isNaN(Number(value)) && Number(value) >= 0), 0),
    occupiedSeats: types.optional(
      types.refinement(types.number, value => !isNaN(Number(value)) && Number(value) >= 0),
      0,
    )
  })
  .views(self => ({
    get isAvailable() {
      return self.maxSeats > self.occupiedSeats;
    },
    get remainingSeats() {
      return self.maxSeats - self.occupiedSeats;
    },
  }));

export default TicketCatalog;
