import * as React from 'react';
import Button from 'antd/lib/button';
import 'antd/dist/antd.css';

export default class App extends React.Component {
  public render() {
    return (
      <section>
        <h1>This is a react component</h1>
        <Button type="primary"> HELLO </Button>
      </section>
    );
  }
}
