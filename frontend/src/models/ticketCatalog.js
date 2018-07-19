import { types } from 'mobx-state-tree';

const TicketCatalog = types.model({
  id: types.optional(
    types.identifier(types.union(types.number, types.string)),
    989898,
  ),
  ticketDescription: types.optional(types.string, 'Single Ticket'),
  price: types.optional(
    types.refinement(
      types.number,
      value => !isNaN(Number(value)) && Number(value) >= 0,
    ),
    0,
  ),
  maxSeats: types.optional(
    types.refinement(
      types.number,
      value => !isNaN(Number(value)) && Number(value) >= 0,
    ),
    0,
  ),
  occupiedSeats: types.optional(
    types.refinement(
      types.number,
      value => !isNaN(Number(value)) && Number(value) >= 0,
    ),
    0,
  ),
});

export default TicketCatalog;
