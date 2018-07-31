import React from 'react';
import PanelErrorCatcher from './PanelErrorCatcher';
import EventFinancialPanel from './EventFinancialPanel';

export default class EventFinancialPanelIndex extends React.Component {
  render() {
    return (
      <PanelErrorCatcher>
        <EventFinancialPanel />
      </PanelErrorCatcher>
    );
  }
}
