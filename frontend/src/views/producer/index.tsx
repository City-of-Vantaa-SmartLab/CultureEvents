import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SignInView from './sign-in';
import DashboardView from './dashboard';

export default class ProducerUI extends React.Component {
  public render() {
    return (
      <Switch>
        <Route path="/producer/login" component={SignInView} />
        <Route path="/producer/dashboard" component={DashboardView} />
        <Route render={props => <Redirect to="./login" />} />
      </Switch>
    );
  }
}
