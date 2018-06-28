import { types } from 'mobx-state-tree';

const TicketCatalog = types.model({
  id: types.optional(types.identifier(types.string), 'defaultTicket'),
  ticketDescription: types.optional(types.string, ''),
  price: types.optional(
    types.refinement(
      types.number,
      value => !isNaN(Number(value)) && Number(value) >= 0,
    ),
    0,
  ),
  availableSeatForThisType: types.optional(
    types.refinement(
      types.number,
      value => !isNaN(Number(value)) && Number(value) >= 0,
    ),
    0,
  ),
});

const Event = types.model({
  name: types.optional(types.string, ''),
  location: types.optional(types.string, ''),
  description: types.optional(types.string, ''),
  date: types.maybe(types.string),
  time: types.maybe(types.string),
  ticketCatalog: types.maybe(types.array(TicketCatalog)),
  contactInformation: types.optional(types.string, ''),
  eventType: types.optional(
    types.enumeration('EventType', [
      'Kurssit Ja Työpajat',
      'Näyttelyt',
      'Esitykset',
    ]),
    'Esitykset',
  ),
  ageGroupLimit: types.optional(
    types.enumeration('AgeGroupLimit', ['0-3', '3-6', '7-12', '13+']),
    '0-3',
  ),
  isWordless: types.optional(types.boolean, false),
  isBilingual: types.optional(types.boolean, false),
  coverImage: types.optional(
    types.string,
    'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350',
  ),
  themeColor: types.optional(types.string, 'blue'),
});

export default Event;
export { TicketCatalog };
