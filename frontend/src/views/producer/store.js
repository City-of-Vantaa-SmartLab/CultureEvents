import EventModel from '../../models/event';
import {
  types,
  onSnapshot,
  flow,
  applySnapshot,
  getSnapshot,
  resolveIdentifier,
} from 'mobx-state-tree';
import Event from '../../models/event';
import { parseTo, pipeable } from '../../utils';

// @TODO: abstract away fetch call. Make code more legible
const BASE_URL = 'http://' + window.location.host;

const transformToMap = (arr = []) => {
  const result = arr.reduce((accumulator, current) => {
    accumulator[current.id] = current;
    return accumulator;
  }, {});
  return result;
};

const removeId = item => {
  delete item.id;
  return item;
};

const User = types
  .model({
    username: '',
    token: types.maybe(types.string),
  })
  .views(self => ({
    get isAuthenticated() {
      return Boolean(self.token);
    },
  }));

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

export const RootProducerModel = types
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
      if (self.events[self.selectedEvent]) self.selectedEvent = null;
      self.fetchEvents();
    },
    // event actions
    selectEvent: id => (self.selectedEvent = id),
    fetchEvents: flow(function*() {
      try {
        self.ui.eventList.fetching = true;
        const response = yield window.fetch(BASE_URL + '/events');
        if (!response.ok)
          throw new Error('Failed to fetch. Server threw HTTP error code');
        const json = yield response.json();
        const processedJson = pipeable(json).pipe(
          parseTo('camelCase'),
          transformToMap,
        );
        self.ui.eventList.fetching = false;
        applySnapshot(self.events, processedJson);
        self.selectedEvent = null;
      } catch (error) {
        console.error(error);
        self.ui.eventList.fetching = false;
        self.ui.eventList.fetchError = 'Could not fetch events ';
      }
    }),
    patchEvent: flow(function*(event) {
      if (!resolveIdentifier(EventModel, self.events, event.id)) {
        // new event. POST
        try {
          self.ui.eventList.fetching = true;
          const response = yield window.fetch(BASE_URL + '/events', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${self.user.token}`,
            },
            method: 'POST',
            body: pipeable(event).pipe(
              parseTo('snake'),
              removeId,
              JSON.stringify,
            ),
          });
          if (!response.ok)
            throw new Error('Failed to fetch. Server threw HTTP error code');
          const json = yield response.json();
          const processedJson = parseTo('camelCase')(json);

          self.ui.eventList.fetching = false;
          self.events.put(processedJson);
          self.selectEvent(processedJson.id);
        } catch (error) {
          console.error(error);
          self.ui.eventList.fetching = false;
          self.ui.eventList.fetchError = 'Could not create event ' + event.name;
        }
      } else {
        // existing event. PUT
        try {
          self.ui.eventList.fetching = true;
          const response = yield window.fetch(
            BASE_URL + '/events/' + event.id,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${self.user.token}`,
              },
              method: 'PUT',
              body: pipeable(event).pipe(
                parseTo('snake'),
                removeId,
                JSON.stringify,
              ),
            },
          );
          if (!response.ok)
            throw new Error('Failed to fetch. Server threw HTTP error code');

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
        const response = yield window.fetch(BASE_URL + '/auth/login', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
        });
        const json = yield response.json();
        self.user.username = json.username;
        self.user.token = json.token;
      } catch (error) {
        console.error(error);
      }
    }),
    logout: () => {
      self.user.token = null;
    },
  }))
  .views(self => ({
    get isEmpty() {
      return Object.keys(self.events.toJSON()).length == 0;
    },
  }));

const rootStore = RootProducerModel.create();

// persist to local storage
onSnapshot(rootStore, snapshot =>
  window.localStorage.setItem('store', JSON.stringify(snapshot)),
);

export default rootStore;
