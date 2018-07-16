import EventModel from './event';
import User from './user';
import { types, flow, applySnapshot, resolveIdentifier } from 'mobx-state-tree';
import {
  fetchEvents,
  postEvent,
  putEvent,
  login as loginAPI,
  getPaymentRedirectUrl,
  validateUserToken,
} from '../apis';
import { removeIdRecursively } from '../utils';

const transformToMap = (arr = []) => {
  const result = arr.reduce((accumulator, current) => {
    accumulator[current.id] = current;
    return accumulator;
  }, {});
  return result;
};

const UI = types.model({
  auth: types.optional(
    types.model({
      // for login; @TODO: maybe move this UI state to User model?
      authInProgress: false,
      authError: false,
      // for validation
      validateTokenInProgress: false,
      validateTokenFailed: false,
    }),
    {},
  ),
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
  orderAndPayment: types.optional(
    types
      .model({
        pending: false,
        redirectUrl: '',
        redirecting: false,
      })
      .actions(self => {
        const clearOrderPendingFlag = () => {
          self.pending = false;
          self.redirecting = false;
        };
        return { clearOrderPendingFlag };
      }),
    {},
  ),
});

export const RootModel = types
  .model({
    events: types.optional(types.map(EventModel), {}),
    selectedEvent: types.maybe(types.reference(EventModel)),
    user: types.optional(User, {}),
    ui: types.optional(UI, {}),
  })
  .actions(self => ({
    // hooks
    afterCreate() {
      // hydrate from localStorage
      if (window.localStorage.getItem('store'))
        applySnapshot(self, JSON.parse(window.localStorage.getItem('store')));
      self.selectedEvent = null;
      // validate token access (only happen in Producer)
      if (self.user.token) self.validateToken();
      // fetch event list from remote
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
          const result = yield postEvent(
            removeIdRecursively(event),
            self.user.token,
          );

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
      self.ui.auth.authInProgress = true;
      self.ui.authError = false;
      try {
        const result = yield loginAPI(username, password);

        self.user.username = result.username;
        self.user.token = result.token;
        self.user.id = result.id;
        console.log('User id is', result.id);

        self.ui.auth.authInProgress = false;
        self.ui.authError = false;
      } catch (error) {
        self.ui.authInProgress = false;
        self.ui.authError = true;
        console.error(error);
      }
    }),
    logout: () => {
      self.user.token = null;
    },
    validateToken: flow(function*() {
      self.ui.auth.validateTokenInProgress = true;
      self.ui.auth.validateTokenFailed = false;
      console.log(self.user.id);
      try {
        yield validateUserToken(self.user.id, self.user.token);
        self.ui.auth.validateTokenFailed = false;
        self.ui.auth.validateTokenInProgress = false;
      } catch (error) {
        self.user.token = null;
        self.ui.auth.validateTokenFailed = true;
        self.ui.auth.validateTokenInProgress = false;
        console.error('Token expired', error);
      }
    }),
    getUserToken: () => {
      return self.user.token;
    },
    // order related actions
    submitOrder: flow(function*(orderInfo) {
      // setting UI
      self.ui.orderAndPayment.pending = true;

      if (orderInfo.type == 'payment') {
        const payload = {
          customer_type: orderInfo.customerGroup,
          event_id: orderInfo.eventId,
          name: orderInfo.name,
          phone: orderInfo.phoneNumber,
          email: orderInfo.email,
          tickets: orderInfo.tickets.map(ticket => ({
            price_id: ticket.value,
            no_of_tickets: ticket.amount,
          })),
        };

        try {
          const result = yield getPaymentRedirectUrl(payload);

          self.ui.orderAndPayment.redirecting = true;
          self.ui.orderAndPayment.redirectUrl = result.redirect_url;
          // setting UI state for success
        } catch (error) {
          // setting UI error
          console.error('Operation to fetch redirect URL failed', error);
        }
      }
    }),
  }))
  .views(self => ({
    get isEmpty() {
      return Object.keys(self.events.toJSON()).length === 0;
    },
  }));

export default RootModel;
