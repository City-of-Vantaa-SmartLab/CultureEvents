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
import posed, { PoseGroup } from 'react-pose';
import Button from '../../../components/button';

const ContainerAnimation = posed.div({
  enter: {
    delay: 600,
    scale: 1,
    opacity: 1,
    staggerChildren: 300,
  },
  exit: {
    delay: 300,
    scale: 0,
    opacity: 0,
    staggerChildren: 200,
  },
  preEnter: {
    scale: 0,
    y: '-5%',
  },
});
const CardContainers = styled(ContainerAnimation)``;
const EmptyStateContainer = styled(ContainerAnimation)`
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
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 1rem;
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
const filterByAgeGroup = age => events => {
  return events.filter(event => event.ageGroupLimits === age);
};
const filterByArea = area => events => {
  return events.filter(event => event.area === area);
};
const filterByDate = month => events =>
  events.filter(event => getMonth(event.date) === month);

const filterByEventType = eventType => events =>
  events.filter(event => event.eventType === eventType);

export default withTheme(
  connect('store')(
    class EventListing extends Component {
      render() {
        const { events, selectedEvent, filters } = this.props.store;
        const { ageGroupLimits, area, eventType, date } = filters;
        // @TODO: beware of performance cost
        // This might not be the best for performance
        // See if we can memoize the filter function
        const displayableEvents = pipeable(values(events)).pipe(
          ageGroupLimits && filterByAgeGroup(ageGroupLimits),
          area && filterByArea(area),
          date && filterByDate(date),
          eventType && filterByEventType(eventType),
        );
        return (
          <Wrapper>
            <PoseGroup withParents={false} animateOnMount>
              {displayableEvents.length > 0 ? (
                <CardContainers key="card-container">
                  {displayableEvents.map((event, index) => (
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
                  ))}
                </CardContainers>
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
            </PoseGroup>
          </Wrapper>
        );
      }
    },
  ),
);
