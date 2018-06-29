import EventModel from '../../models/event';
import { types, onSnapshot } from 'mobx-state-tree';
import Event from '../../models/event';

const mockEvent = {
  '1': {
    id: '1',
    name: 'Pet the cat!',
    location: 'Korso',
    date: '2018-07-11',
    time: '16:32',
    performer: 'SpongeBob',
    contactInformation: '+3589473843',
    ticketCatalog: null,
    coverImage:
      'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350',
    themeColor: '#EC9D5C',
    ageGroupLimit: '13+',
    isWordless: true,
  },
  '2': {
    id: '2',
    name: 'Meet thor!',
    location: 'Tikkurila',
    date: '2018-07-12',
    time: '16:32',
    performer: 'Chris Hemsworth',
    contactInformation: '+3589473843',
    ticketCatalog: null,
    coverImage: 'https://media.giphy.com/media/9vVCPK87Aw6v6/giphy.gif',
    themeColor: '#09B0B8',
    ageGroupLimit: '13+',
    isBilingual: true,
  },
};

export const RootProducerModel = types
  .model({
    events: types.optional(types.map(EventModel), mockEvent),
    selectedEvent: types.maybe(types.reference(EventModel)),
  })
  .actions(self => ({
    addEvent: event => self.events.set(event.id, EventModel.create(event)),
    selectEvent: id => (self.selectedEvent = id),
    alterEvent: event => {
      console.log('AlterEvent called');
      self.events.set(event.id, event);
    },
  }));

const rootStore = RootProducerModel.create();
onSnapshot(rootStore.events, console.log);
export default rootStore;
