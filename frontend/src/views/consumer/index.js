import React from 'react';
import Appbar from './app-bar';
import RootStore from '../../models';
import { Provider } from 'mobx-react';
import EventListing from './event-listing';

const store = RootStore.create();

export default class ConsumerUI extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Appbar />
          <EventListing />
        </div>
      </Provider>
    );
  }
}
