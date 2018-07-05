import React from 'react';
import styled from 'styled-components';
import { render } from 'react-dom';
import EventCard from '../../../../components/event-card';
import Button from '../../../../components/button';
import Typography from '../../../../components/typography';
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
  flex-shrink: 0;
  flex-grow: 0;
`;

const EmptyStateContainer = styled.div`
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class EventExplorer extends React.Component {
  render() {
    const { events } = this.props.store;
    return (
      <React.Fragment>
        <WrapperFlat />
        <Wrapper>
          {!this.props.store.isEmpty ? (
            Object.values(this.props.store.events.toJSON()).map(event => (
              <EventCard
                style={{ marginBottom: '0.5rem' }}
                key={event.id}
                themeColor={event.themeColor}
                name={event.name}
                location={event.location}
                date={event.eventDate}
                time={event.eventTime}
                performer={event.performer}
                coverImage={event.coverImage}
                ageGroupLimit={event.ageGroupLimit}
                onSelect={() => this.props.store.selectEvent(event.id)}
              />
            ))
          ) : (
            <EmptyStateContainer>
              <Typography type="subheader" backgroundColor="transparent">
                There is no event found
              </Typography>
              <Typography type="body">
                Adjust your filter, or add new event
              </Typography>
            </EmptyStateContainer>
          )}
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default connect('store')(EventExplorer);
