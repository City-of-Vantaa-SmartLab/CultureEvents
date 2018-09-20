import React from 'react';
import { createPortal } from 'react-dom';
import styled, { withTheme } from 'styled-components';
import './print.css';
import Button from 'components/button';
import { connect } from 'utils';
import Typography from 'components/typography';
import { values } from 'mobx';
import Icon from 'antd/lib/icon';
import { observer } from 'mobx-react';

const FullScreenModal = styled.article`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: auto;
  background-color: white;
  display: flex;
  justify-content: center;
  display: ${({ shown }) => (shown ? 'block' : 'none')};
  overflow: auto;

  button {
    margin-bottom: 1rem;
    @media print {
      display: none;
    }
  }
  & > button {
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
`;
const ScrollContainer = styled.div`
  @media only screen {
    margin: 3rem;
  }
  max-width: 1600px;
  width: auto;
  & > ul {
    margin-top: 2rem;
  }
`;

const HeadSectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LiStyled = styled.li`
  list-style: none;
  margin: 1rem;
  display: flex;

  li {
    list-style: disc;
  }

  & > div {
    display: inline-block;
    margin-left: 1rem;

    & > ul {
      margin: 0.5rem;
      padding-left: 1rem;
    }
  }
`;

const CheckBoxDecorative = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 2px;
  border: 1px ${props => props.color} solid;
`;

const ReservationListItem = observer(
  ({ reservation, event, requestEditReservation }) => {
    const {
      customerType,
      name,
      schoolName,
      class: className,
      phone,
      email,
      paymentCompleted,
      tickets,
    } = reservation;
    const isPrivateCustomer = customerType === 'private';
    const totalCost = tickets.reduce((acc, curr) => {
      const { price } = event.catalogById(curr.priceId);
      return (acc += price * curr.noOfTickets);
    }, 0);

    return (
      <LiStyled key={reservation.id}>
        {paymentCompleted ? (
          <Icon type="check-circle-o" style={{ color: event.themeColor }} />
        ) : (
            <CheckBoxDecorative color={event.themeColor} />
          )}
        <div>
          {isPrivateCustomer ? (
            <Typography style={{ margin: 0 }} type="paragraph" show={true}>
              {name}
            </Typography>
          ) : (
              <Typography style={{ margin: 0 }} type="paragraph" show={true}>
                {name}, {schoolName}, {className}, {phone}, {email}
              </Typography>
            )}
          <ul>
            {tickets.map(ticket => {
              const catalog = event.catalogById(ticket.priceId);
              return (
                <li key={ticket.priceId}>
                  <Typography type="body">
                    {catalog.ticketDescription} {ticket.noOfTickets} kpl {catalog.price * ticket.noOfTickets} €
                </Typography>
                </li>
              );
            })}
          </ul>
          <Typography type="largebody" color={event.themeColor}>
            Yhteensä: {totalCost} €
        </Typography>
          <br />
          <Button backgroundColor={event.themeColor} onClick={requestEditReservation}>
            Muokkaa
        </Button>
        </div>
      </LiStyled>
    );
  });

class ReservationList extends React.Component {
  selectReservation(reservation) {
    // TODO: Find appropriate abstraction for this
    this.props.store.selectReservation(reservation.id);
    this.props.store.ui.orderAndPayment.toggleEditionModal();
  }

  render() {
    const { palette } = this.props.theme;
    const { reservationsAndOrders, selectedEvent, ui } = this.props.store;
    if (!reservationsAndOrders || !selectedEvent) return null;
    const reservations = values(reservationsAndOrders).filter(
      r => r.eventId === selectedEvent.id,
    );
    if (!reservations) return null;

    return createPortal(
      <FullScreenModal shown={ui.orderAndPayment.listingShown}>
        <Button
          icon="close"
          backgroundColor={palette.red}
          onClick={ui.orderAndPayment.toggleShowListing}
        >
          Takaisin
        </Button>
        <ScrollContainer>
          <HeadSectionContainer>
            <div>
              <Typography
                type="headline"
                color={palette.primaryDeep}
                style={{ margin: 0 }}
              >
                Vantaa Kulttuuria{' '}
              </Typography>
              <Typography type="subheader">Varauslista</Typography>
              <Button onClick={window.print}>Tulosta</Button>
            </div>
            <div>
              <Typography type="body">Tapahtuma</Typography>
              <Typography type="subheader" color={selectedEvent.themeColor}>
                {selectedEvent.name}
              </Typography>
              <Typography type="body">
                {selectedEvent.area} - {selectedEvent.eventDate} kello{' '}
                {selectedEvent.eventTime}
              </Typography>
            </div>
          </HeadSectionContainer>
          <hr />
          <ul style={{ padding: 0 }}>
            {reservations
              .sort((a, b) => {
                return a.name[0] < b.name[0];
              })
              .map((r, index) => (
                <div className="page-break">
                  <ReservationListItem
                    key={index}
                    reservation={r}
                    event={selectedEvent}
                    requestEditReservation={() => this.selectReservation(r)}
                  />
                </div>
              ))}
          </ul>
        </ScrollContainer>
      </FullScreenModal>,
      document.querySelector('body'),
    );
  }
}

export default withTheme(connect('store')(ReservationList));
