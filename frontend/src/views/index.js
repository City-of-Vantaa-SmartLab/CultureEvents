import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import Loadable from 'react-loadable';

const LazyProducerUI = Loadable({
  loader: () => import('./producer'),
  loading: () => <h1>Loading</h1>,
});
const LazyConsumerUI = Loadable({
  loader: () => import('./consumer'),
  loading: () => <h1>Loading your beautiful UI</h1>,
});

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/producer" component={LazyProducerUI} />
            <Route path="/consumer" component={LazyConsumerUI} />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}
