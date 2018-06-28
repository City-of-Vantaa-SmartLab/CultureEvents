import EventModel, { TicketCatalog } from './event';

test('event model has correct default', () => {
  const defaultEventCreated = EventModel.create().toJSON();

  const expectation = {
    name: '',
    location: '',
    description: '',
    date: null,
    time: null,
    ticketCatalog: null,
    eventType: 'Esitykset',
    ageGroupLimit: '0-3',
    isWordless: false,
    isBilingual: false,
    contactInformation: '',
    coverImage:
      'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350',
    themeColor: 'blue',
  };
  expect(defaultEventCreated).toEqual(expectation);
});

test('eventModel instantiated from backup correctly', () => {
  const snapshotTypeA = {
    id: 'typeA',
    ticketDescription: 'Ticket mock of type A',
    price: 100,
    availableSeatForThisType: 50,
  };
  const snapshotTypeB = {
    id: 'typeB',
    ticketDescription: 'Ticket mock of type B',
    price: 150,
    availableSeatForThisType: 43,
  };
  const expectation = {
    name: '',
    location: '',
    description: '',
    date: null,
    time: null,
    ticketCatalog: [snapshotTypeA, snapshotTypeB],
    eventType: 'Esitykset',
    ageGroupLimit: '0-3',
    isWordless: false,
    isBilingual: false,
    contactInformation: '',
    coverImage:
      'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350',
    themeColor: 'blue',
  };
  const model = EventModel.create(expectation);
  expect(model.toJSON()).toEqual(expectation);
});
