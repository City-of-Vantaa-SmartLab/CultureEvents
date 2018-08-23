import EventModel from './event';

test('event model has correct default', () => {
  const defaultEventCreated = EventModel.create({ id: '1' }).toJSON();

  const expectation = {
    id: '1',
    name: '',
    location: '',
    description: '',
    date: null,
    time: null,
    ticketCatalog: null,
    eventType: 'Esitykset',
    ageGroupLimits: '0-3',
    isWordless: false,
    isBilingual: false,
    contactInformation: '',
    performer: null,
    coverImage:
      'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350',
    themeColor: '#498DC7',
  };
  expect(defaultEventCreated).toEqual(expectation);
});

test('eventModel instantiated from backup correctly', () => {
  const snapshotTypeA = {
    id: 'typeA',
    ticketDescription: 'Ticket mock of type A',
    price: 100,
    maxSeats: 50,
  };
  const snapshotTypeB = {
    id: 'typeB',
    ticketDescription: 'Ticket mock of type B',
    price: 150,
    maxSeats: 43,
  };
  const expectation = {
    id: '1',
    name: '',
    location: '',
    description: '',
    date: null,
    time: null,
    ticketCatalog: [snapshotTypeA, snapshotTypeB],
    eventType: 'Esitykset',
    ageGroupLimits: '0-3',
    isWordless: false,
    isBilingual: false,
    contactInformation: '',
    performer: null,
    coverImage:
      'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350',
    themeColor: '#498DC7',
  };
  const model = EventModel.create(expectation);
  expect(model.toJSON()).toEqual(expectation);
});
