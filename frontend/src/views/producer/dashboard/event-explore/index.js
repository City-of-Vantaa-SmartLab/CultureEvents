import React from 'react';
import styled from 'styled-components';
import EventCard from '../../../../components/event-card';
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
            Object.values(events.toJSON()).map(event => (
              <EventCard
                style={{ marginBottom: '0.5rem' }}
                key={event.id}
                event={event}
                onSelect={() => this.props.store.selectEvent(event.id)}
              />
            ))
          ) : (
            <EmptyStateContainer>
              <Typography type="subheader" backgroundColor="transparent">
                Tapahtumaa ei löytynyt
              </Typography>
              <Typography type="body">
                Muuta suodatusta tai lisää uusi tapahtuma
              </Typography>
            </EmptyStateContainer>
          )}
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default connect('store')(EventExplorer);
