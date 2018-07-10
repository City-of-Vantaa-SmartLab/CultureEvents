import React from 'react';
import Appbar from './app-bar';
import RootStore from '../../models';
import styled from 'styled-components';
import { Provider } from 'mobx-react';
import EventListing from './event-listing';
import { onSnapshot } from '../../../node_modules/mobx-state-tree';

const store = RootStore.create();
onSnapshot(store, console.log);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export default class ConsumerUI extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Wrapper>
          <Appbar />
          <EventListing />
        </Wrapper>
      </Provider>
    );
  }
}
