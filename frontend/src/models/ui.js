import { types } from 'mobx-state-tree';
import EventModel from './event';

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
    types
      .model({
        fetching: false,
        fetchError: types.optional(
          types.union(types.string, types.boolean),
          false,
        ),
        // 0: unasked, 1: waiting for confirmation, 2: in action, 3: completed, 4: failed
        deleteEventStatus: types.optional(types.number, 0),
      })
      .actions(self => ({
        clearDeletionFlag() {
          self.deleteEventStatus = 0;
        },
        setAskConfirmation() {
          self.deleteEventStatus = 1;
        },
      })),
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
        listingShown: types.optional(types.boolean, false),
      })
      .actions(self => {
        const clearOrderPendingFlag = () => {
          self.redirectStatus = 0;
          self.redirectUrl = '';
        };
        const clearReservationFlag = () => {
          self.reservationStatus = 0;
          self.reservedEvent = undefined;
        };
        const toggleShowListing = () => {
          self.listingShown = !self.listingShown;
        };
        return {
          clearOrderPendingFlag,
          clearReservationFlag,
          toggleShowListing,
        };
      }),
    {},
  ),
});

export default UI;
