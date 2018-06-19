import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProducerUI from './producer';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

export default class App extends React.Component {
  public render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/producer" component={ProducerUI} />
            <Route render={props => <h1>ConsumerUI</h1>} />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}
