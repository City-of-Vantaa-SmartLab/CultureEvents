import React, { Component } from 'react';
import styled from 'styled-components';
import EventCard from '../../../components/event-card';
import EventDetail from './EventDetail';
import EventBooking from './EventBooking';
import { connect } from '../../../utils';
import { values } from 'mobx';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 2rem 1rem;

  & > * {
    flex-shrink: 0;
    flex-grow: 0;
  }
`;

export default connect('store')(
  class EventListing extends Component {
    render() {
      const { events, selectedEvent } = this.props.store;
      return (
        <Wrapper>
          {!this.props.store.isEmpty ? (
            values(events).map(event => (
              <EventCard
                expandable
                active={selectedEvent && selectedEvent.id == event.id}
                style={{ marginBottom: '0.7rem' }}
                key={event.id}
                event={event}
                onSelect={() => this.props.store.selectEvent(event.id)}
                onDeselect={this.props.store.deselectEvent}
              >
                <EventDetail event={event} />
                <EventBooking event={event} />
              </EventCard>
            ))
          ) : (
            <h1>Nothing to see here</h1>
          )}
        </Wrapper>
      );
    }
  },
);
