import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import EventCard from '../../../components/event-card';
import EventDetail from './EventDetail';
import EventBooking from './EventBooking';
import { connect, pipeable } from '../../../utils';
import NotFoundIcon from '../../../assets/NotFoundIcon';
import Typography from '../../../components/typography';
import getMonth from 'date-fns/get_month';
import { values } from 'mobx';
import Button from '../../../components/button';

const EmptyStateContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.5);
  font-size: 2rem;

  svg {
    fill: ${props => props.theme.palette.primaryDeep};
    width: 5rem;
  }
  & > * {
    margin: 1rem;
  }
`;

const Wrapper = styled.div`
  transform: translateZ(0);
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  will-change: transform;
  padding: 1rem;
  -webkit-overflow-scroll: touch;

  background-image: linear-gradient(
    to top,
    #d5d4d0 0%,
    #d5d4d0 1%,
    #eeeeec 31%,
    #efeeec 75%,
    #e9e9e7 100%
  );

  & > * {
    flex-shrink: 0;
    flex-grow: 0;
  }
`;
const filterByAgeGroup = ages => events => {
  return events.filter(
    event => event.ageGroupLimits.filter(ag => ages.includes(ag)).length > 0,
  );
};
const filterByArea = areas => events => {
  return events.filter(event => areas.includes(event.area));
};
const filterByDate = months => events => {
  return events.filter(event => months.includes(getMonth(event.eventDate) + 1));
};
const filterByEventType = eventType => events =>
  events.filter(event => event.eventType === eventType);

export default withTheme(
  connect('store')(
    class EventListing extends Component {
      render() {
        const { events, selectedEvent, filters } = this.props.store;
        const { ageGroupLimits, areas, eventTypes, months } = filters;
        // @TODO: beware of performance cost
        // This might not be the best for performance
        // See if we can memoize the filter function
        const displayableEvents = pipeable(values(events)).pipe(
          ageGroupLimits.length > 0 && filterByAgeGroup(ageGroupLimits),
          areas.length > 0 && filterByArea(areas),
          months.length > 0 && filterByDate(months),
          eventTypes.length > 0 && filterByEventType(eventTypes),
        );

        return (
          <Wrapper>
            {displayableEvents.length > 0 ? (
              displayableEvents.map((event, index) => (
                <EventCard
                  expandable
                  active={selectedEvent && selectedEvent.id === event.id}
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
              <EmptyStateContainer key={'emptyState'}>
                <NotFoundIcon />
                <Typography type="body">
                  Ei osumia!<br />
                  Kokeile laajentaa hakuehtoja
                </Typography>
                <Button
                  onClick={filters.clearAllFilters}
                  backgroundColor={this.props.theme.palette.primaryDeep}
                >
                  POISTA RAJAUKSET
                </Button>
              </EmptyStateContainer>
            )}
          </Wrapper>
        );
      }
    },
  ),
);
