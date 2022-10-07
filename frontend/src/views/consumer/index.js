import React from 'react';
import Appbar from './app-bar';
import RootStore from 'models';
import styled from 'styled-components';
import { Provider } from 'mobx-react';
import EventListing from './event-listing';
import FilterView from './filter-view';
import PaymentProvidersModal from './payment-providers-modal';
import ReservationStatusModal from './reservation-status-modal';
import PaymentStatusModal from './paymentstatus-modal';
import WelcomeModal from './welcome-modal';

const store = RootStore.create();

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

export default class ConsumerUI extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Wrapper>
          <WelcomeModal />
          <Appbar />
          <EventListing />
          <FilterView />
          <PaymentProvidersModal />
          <PaymentStatusModal />
          <ReservationStatusModal />
        </Wrapper>
      </Provider>
    );
  }
}
