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
  postReservation,
  getReservations,
} from '../apis';
import { removeIdRecursively } from '../utils';
import FilterModel from './filter';
import ReservationAndOrder from './bookingsAndOrders';

const transformToMap = (arr = []) => {
  const result = arr.reduce((accumulator, current) => {
    accumulator[current.id] = current;
    return accumulator;
  }, {});
  return result;
};

const UI = types.model({
  filterViewActive: types.optional(types.boolean, false),
  auth: types.optional(
    types
      .model({
        // for login; @TODO: maybe move this UI state to User model?
        authInProgress: false,
        authError: false,
        // for validation
        validateTokenInProgress: false,
        validateTokenFailed: false,
      })
      .actions(self => ({
        clearValidationError: () => {
          self.validateTokenFailed = false;
          self.validateTokenInProgress = false;
        },
      })),
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
        // for payment
        redirectStatus: types.optional(
          types.refinement(
            'Redirect code',
            types.number,
            v => v >= 0 && v <= 3,
          ),
          0,
        ),
        redirectUrl: '',
        // for reservation
        reservationStatus: types.optional(
          types.refinement(
            'Reservation Code',
            types.number,
            value => value >= 0 && value <= 3,
          ),
          0,
        ),
        reservedEvent: types.maybe(types.reference(EventModel)),
      })
      .actions(self => {
        const clearOrderPendingFlag = () => {
          self.redirectStatus = 0;
          self.redirectUrl = '';
        };
        const clearReservationFlag = () => {
          self.reservationStatus = 0;
          self.reservedEvent = null;
        };

        return { clearOrderPendingFlag, clearReservationFlag };
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
    filters: types.optional(FilterModel, {}),
    reservationsAndOrders: types.maybe(types.map(ReservationAndOrder)),
  })
  .actions(self => ({
    // hooks
    afterCreate() {
      // hydrate from localStorage
      try {
        if (window.localStorage.getItem('store'))
          applySnapshot(self, JSON.parse(window.localStorage.getItem('store')));
      } catch (error) {
        console.log('Failed to apply snapshot');
      }
      self.selectedEvent = null;
      // validate token access (only happen in Producer)
      if (self.user.token) self.validateToken();
      // fetch event list from remote
      self.fetchEvents();
      self.fetchReservationsAndOrders();
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
    // filter related activity
    toggleFilterView: () => {
      self.ui.filterViewActive = !self.ui.filterViewActive;
    },
    updateAvailableSeat: (eventId, ticketCatalogId, amount) => {
      const resolvedEvent = resolveIdentifier(EventModel, self.events, eventId);
      if (!resolvedEvent)
        throw new Error('UpdateAvailableSeat failed. Cant find the event');
      const resolveTicketType = resolvedEvent.ticketCatalog.find(
        catalogs => catalogs.id === ticketCatalogId,
      );
      if (resolveTicketType.maxSeats < resolveTicketType.occupiedSeats + amount)
        throw new Error(
          `Invalid amount of seat. There are max ${
            resolveTicketType.maxSeats
          }, and there are ${
            resolveTicketType.occupiedSeats
          } while you try to occupy ${amount} seats`,
        );
      resolveTicketType.occupiedSeats += amount;
    },
    // order related actions
    submitOrder: flow(function*(orderInfo) {
      // setting UI
      if (orderInfo.type == 'payment') {
        self.ui.orderAndPayment.redirectStatus = 1;

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

          // setting UI state for success
          self.ui.orderAndPayment.redirectStatus = 2;
          self.ui.orderAndPayment.redirectUrl = result.redirect_url;
        } catch (error) {
          // setting UI error
          self.ui.orderAndPayment.redirectStatus = 3;
          console.error('Operation to fetch redirect URL failed', error);
        }
      }
      if (orderInfo.type == 'reservation') {
        self.ui.orderAndPayment.reservationStatus = 1;
        try {
          const payload = {
            customer_type: orderInfo.customerGroup,
            event_id: orderInfo.eventId,
            school_name: orderInfo.school,
            name: orderInfo.school + ' ' + orderInfo.classRoom,
            class: orderInfo.classRoom,
            phone: orderInfo.phoneNumber
              .replace(/^0/, '+358')
              .replace(/\s/g, ''),
            email: orderInfo.email,
            tickets: orderInfo.tickets.map(ticket => ({
              price_id: ticket.value,
              no_of_tickets: ticket.amount,
            })),
          };

          const result = yield postReservation(payload);
          self.ui.orderAndPayment.reservedEvent = result.event_id;
          payload.tickets.forEach(ticket =>
            self.updateAvailableSeat(
              orderInfo.eventId,
              ticket.price_id,
              ticket.no_of_tickets,
            ),
          );
          // @TODO: somehow add this result into a reservation model
          self.ui.orderAndPayment.reservationStatus = 2;
        } catch (error) {
          console.error(error);
          self.ui.orderAndPayment.reservationStatus = 3;
        }
      }
    }),
    fetchReservationsAndOrders: flow(function*() {
      try {
        // @TODO: UI state for fetching reservations
        const result = yield getReservations();
        self.reservationsAndOrders = transformToMap(result);
      } catch (error) {
        console.error(error);
      }
    }),
  }))
  .views(self => ({
    get isEmpty() {
      return Object.keys(self.events.toJSON()).length === 0;
    },
  }));

export default RootModel;
