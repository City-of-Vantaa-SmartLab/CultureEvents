import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import Loadable from 'react-loadable';
import { Redirect } from 'react-router-dom';
import LoadingView from './intro';

const LazyProducerUI = Loadable({
  loader: () => import('./producer'),
  loading: LoadingView,
  delay: 200,
});
const LazyConsumerUI = Loadable({
  loader: () => import('./consumer'),
  loading: LoadingView,
});

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path="/producer" component={LazyProducerUI} />
            <Route path="/consumer" component={LazyConsumerUI} />
            <Route
              exact
              path="/"
              render={props => <Redirect to="/consumer" />}
            />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}
