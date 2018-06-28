import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProducerUI from './index';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/producer" component={ProducerUI} />
            <Route render={() => <h1>ConsumerUI</h1>} />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}
