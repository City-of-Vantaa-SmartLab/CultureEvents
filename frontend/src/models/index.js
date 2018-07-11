import EventModel from './event';
import User from './user';
import { types, flow, applySnapshot, resolveIdentifier } from 'mobx-state-tree';
import { fetchEvents, postEvent, putEvent, login as loginAPI } from '../apis';

const transformToMap = (arr = []) => {
  const result = arr.reduce((accumulator, current) => {
    accumulator[current.id] = current;
    return accumulator;
  }, {});
  return result;
};

const removeId = item => {
  const itemClone = { ...item };
  delete itemClone.id;
  return itemClone;
};

const UI = types.model({
  eventList: types.optional(
    types.model({
      fetching: false,
      fetchError: types.optional(
        types.union(types.string, types.boolean),
        false,
      ),
    }),
    {},
  ),
});

export const RootModel = types
  .model({
    events: types.optional(types.map(EventModel), {}),
    selectedEvent: types.maybe(types.reference(EventModel)),
    user: types.optional(User, User.create().toJSON()),
    ui: types.optional(UI, {}),
  })
  .actions(self => ({
    // hooks
    afterCreate() {
      if (window.localStorage.getItem('store'))
        applySnapshot(self, JSON.parse(window.localStorage.getItem('store')));
      self.selectedEvent = null;
      self.fetchEvents();
    },
    // event actions
    selectEvent: id => (self.selectedEvent = id),
    deselectEvent: () => {
      if (self.selectedEvent) self.selectedEvent = null;
    },
    fetchEvents: flow(function*() {
      try {
        self.ui.eventList.fetching = true;

        const result = yield fetchEvents();
        const processedResult = transformToMap(result);

        self.ui.eventList.fetching = false;
        applySnapshot(self.events, processedResult);
      } catch (error) {
        console.error(error);
        self.ui.eventList.fetching = false;
        self.ui.eventList.fetchError = 'Could not fetch events';
      }
    }),
    patchEvent: flow(function*(event) {
      if (!resolveIdentifier(EventModel, self.events, event.id)) {
        // new event. POST
        try {
          self.ui.eventList.fetching = true;
          const result = yield postEvent(removeId(event), self.user.token);

          self.ui.eventList.fetching = false;
          self.events.put(result);
          self.selectEvent(result.id);
        } catch (error) {
          console.error(error);
          self.ui.eventList.fetching = false;
          self.ui.eventList.fetchError = 'Could not create event ' + event.name;
        }
      } else {
        // existing event. PUT
        try {
          self.ui.eventList.fetching = true;
          yield putEvent(event, self.user.token);

          self.ui.eventList.fetching = false;
          self.events.put(event);
        } catch (error) {
          console.error(error);
          self.ui.eventList.fetching = false;
          self.ui.eventList.fetchError = 'Could not modify event ' + event.name;
        }
      }
    }),
    // auth actions
    login: flow(function*(username, password) {
      try {
        const result = yield loginAPI(username, password);

        self.user.username = result.username;
        self.user.token = result.token;
      } catch (error) {
        console.error(error);
      }
    }),
    logout: () => {
      self.user.token = null;
    },
    getUserToken: () => {
      return self.user.token;
    },
  }))
  .views(self => ({
    get isEmpty() {
      return Object.keys(self.events.toJSON()).length === 0;
    },
  }));

export default RootModel;
