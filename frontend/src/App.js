import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Vantaa Culture Events</h1>
        </header>
        <p className="App-intro">
          This is a PWA app for making culture event reservations!.
        </p>
      </div>
    );
  }
}

export default App;
