import React from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';
import EventCard from '../../../../components/event-card';
import { connect } from '../../../../utils';

const Wrapper = styled.div`
  padding: 1rem;
  padding-top: calc(3rem + 5rem);
  height: 100%;
  width: 25rem;
  background-color: white;
  box-shadow: 3px 0 12px rgba(0, 0, 0, 0.25);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  overflow: auto;
`;
const WrapperFlat = styled(Wrapper)`
  position: relative;
  pointer-events: none;
  background-color: transparent;
  box-shadow: none;
  margin-right: 2rem;
`;

class EventExplorer extends React.Component {
  render() {
    const { events } = this.props.store;
    return (
      <React.Fragment>
        <Wrapper>
          {this.props.store.events
            ? Object.values(this.props.store.events.toJSON()).map(event => (
                <EventCard
                  style={{ marginBottom: '0.5rem' }}
                  key={event.id}
                  themeColor={event.themeColor}
                  name={event.name}
                  location={event.location}
                  date={event.date}
                  time={event.time}
                  performer={event.performer}
                  coverImage={event.coverImage}
                  ageGroupLimit={event.ageGroupLimit}
                  onSelect={() => this.props.store.selectEvent(event.id)}
                />
              ))
            : 'There is nothing here'}
        </Wrapper>
        <WrapperFlat />
      </React.Fragment>
    );
  }
}

export default connect('store')(EventExplorer);
