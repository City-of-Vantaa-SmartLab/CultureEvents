import * as React from 'react';
import Button from 'antd/lib/button';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export default class App extends React.Component {
  public render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/producer"
            render={props => (
              <section>
                <h1>ProducerUI</h1>
                <Button type="primary">HELLO</Button>
              </section>
            )}
          />
          <Route render={props => <h1>ConsumerUI</h1>} />
        </Switch>
      </Router>
    );
  }
}
