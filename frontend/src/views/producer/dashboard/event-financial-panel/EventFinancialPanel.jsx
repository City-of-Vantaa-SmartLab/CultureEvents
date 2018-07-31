import React from 'react';
import styled, { withTheme } from 'styled-components';
import Typography from '../../../../components/typography';
import Icon from 'antd/lib/icon';
import { connect } from '../../../../utils';
import { values } from 'mobx';

const Wrapper = styled.div`
  margin: 1rem;
  flex-basis: 20rem;
  margin-top: calc(3rem + 5rem);
  background-color: white;
  border-radius: 8px;
  overflow: auto;
  padding: 1rem;
  ${props => !props.show && 'display: none;'};
`;
const StyledList = styled.li`
  list-style: none;
  ul {
    padding: 0.5rem;
  }
  i {
    color: ${props => props.color};
    margin-right: 0.5rem;
    font-weight: 800;
  }
`;

export const ListItem = ({ style, iconName, title, children, color }) => (
  <StyledList style={style} color={color}>
    <div>
      {iconName && <Icon type={iconName} />}
      <Typography type="largebody" color={color}>
        {title}
      </Typography>
    </div>
    {React.isValidElement(children) ? (
      <ul>{children}</ul>
    ) : (
      <Typography type="body">{children}</Typography>
    )}
  </StyledList>
);
const ListWrapper = styled.ul`
  padding: 0;
  padding-top: 0.5rem;
  margin: 0;
`;

export default withTheme(
  connect('store')(
    class EventFinancialPanel extends React.Component {
      render() {
        const thisEvent = this.props.store.selectedEvent;
        const reservationList =
          thisEvent && this.props.store.reservationsAndOrders
            ? values(this.props.store.reservationsAndOrders).filter(
                r => r.eventId.id == thisEvent.id,
              )
            : [];

        const palette = this.props.theme.palette;
        // @TODO: reduce nesting. Divide this component into smaller fragments for readability
        return (
          <Wrapper show={thisEvent}>
            <Typography type="subheader">Reservation status</Typography>
            <ListWrapper>
              <ListItem title="Seats left" color={palette.primaryDeep}>
                {thisEvent && thisEvent.totalAvailableTickets}
              </ListItem>
              <ListItem title="Reservations" color={palette.primaryDeep}>
                {reservationList.map(elem => {
                  return (
                    <div>
                      <ListItem
                        title={elem.name}
                        color={
                          elem.paymentCompleted
                            ? palette.lightGreen
                            : palette.primary
                        }
                        iconName={elem.paymentCompleted && 'check'}
                      >
                        <div>
                          <Typography type="body">{elem.phone}</Typography>
                          <br />
                          {elem.tickets.map(ticket => {
                            const ticketName = elem.eventId.ticketCatalog.find(
                              c => c.id === ticket.priceId,
                            ).ticketDescription;
                            return (
                              <React.Fragment>
                                <Typography type="largebody">
                                  {ticketName}:{' '}
                                </Typography>
                                <Typography type="body">
                                  {ticket.noOfTickets}
                                </Typography>
                                {elem.email && (
                                  <Typography type="body">
                                    {elem.email}
                                  </Typography>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </ListItem>
                    </div>
                  );
                })}
              </ListItem>
            </ListWrapper>
          </Wrapper>
        );
      }
    },
  ),
);
