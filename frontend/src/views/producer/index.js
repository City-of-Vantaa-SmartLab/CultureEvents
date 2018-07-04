import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SignInView from './sign-in';
import DashboardView from './dashboard';
import { Provider } from 'mobx-react';
import store from './store';

export default class ProducerUI extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Switch>
          <Route path="/producer/login" component={SignInView} />
          <Route path="/producer/dashboard" component={DashboardView} />
          <Route render={() => <Redirect to="./login" />} />
        </Switch>
      </Provider>
    );
  }
}
