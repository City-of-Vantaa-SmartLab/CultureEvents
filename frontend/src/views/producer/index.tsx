import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SignInView from './sign-in';

export default class ProducerUI extends React.Component {
  public render() {
    return (
      <Switch>
        <Route path="/producer/login" component={SignInView} />
        <Route render={props => <Redirect to="producer/login" />} />
      </Switch>
    );
  }
}
