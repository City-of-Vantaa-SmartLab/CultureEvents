import EventCard from './index';

export default {
  component: EventCard,
  props: {
    active: false,
    mini: false,
    onSelect: () => console.log('clicked'),
    event: {
      id: '1',
      name: 'Hello Kitty',
      location: '',
      description: '',
      eventDate: '07-19-2018',
      eventTime: '20:22',
      ticketCatalog: [
        {
          id: 'typeA',
          ticketDescription: 'Ticket mock of type A',
          price: 100,
          maxSeats: 50,
        },
        {
          id: 'typeB',
          ticketDescription: 'Ticket mock of type B',
          price: 150,
          maxSeats: 43,
        },
      ],
      eventType: 'Esitykset',
      ageGroupLimits: ['0-3'],
      isWordless: false,
      isBilingual: false,
      contactInformation: '',
      area: 'Tikkurila',
      performer: null,
      coverImage:
        'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350',
      themeColor: 'indigo',
    },
  },
};
