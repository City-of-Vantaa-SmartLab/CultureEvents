import React from 'react';
import { createPortal } from 'react-dom';
import styled, { withTheme } from 'styled-components';
import './print.css';
import { connect } from 'utils';
import Typography from 'components/typography';
import { values } from 'mobx';
import CheckBox from 'antd/lib/checkbox';

const FullScreenModal = styled.article`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
`;
const ScrollContainer = styled.div`
  margin: 3rem;
  max-width: 1600px;
  width: 100%;

  & > ul {
    margin-top: 2rem;
  }
`;

const LiStyled = styled.li`
  list-style: none;
  margin: 1rem;
  display: flex;

  & > div {
    display: inline-block;
    margin-left: 1rem;

    & > ul {
      margin: 0.5rem;
      padding-left: 1rem;
    }
  }
`;

const ReservationListItem = ({ reservation, event }) => {
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
      <CheckBox checked={paymentCompleted} />
      <div>
        {isPrivateCustomer ? (
          <Typography
            style={{ margin: 0, fontSize: '1.5rem' }}
            type="largebody"
          >
            {reservation.name}
          </Typography>
        ) : (
          <Typography
            style={{ margin: 0, fontSize: '1.5rem' }}
            type="largebody"
          >
            {reservation.name}, {schoolName}, {className}
          </Typography>
        )}
        <br />
        <Typography type="body">
          {phone} {email && '· ' + email}
        </Typography>
        <ul>
          {tickets.map(ticket => {
            const catalog = event.catalogById(ticket.priceId);
            return (
              <li key={ticket.id}>
                <Typography type="body">
                  {catalog.ticketDescription} {ticket.noOfTickets} kpl{' '}
                  {catalog.price * ticket.noOfTickets} €
                </Typography>
              </li>
            );
          })}
        </ul>
        <Typography
          type="largebody"
          color={event.themeColor}
          style={{ fontSize: '1.2rem' }}
        >
          Yhteensa: {totalCost} €
        </Typography>
      </div>
    </LiStyled>
  );
};

class ReservationList extends React.Component {
  render() {
    const { palette } = this.props.theme;
    const { reservationsAndOrders, selectedEvent } = this.props.store;
    if (!reservationsAndOrders || !selectedEvent) return null;
    const reservations = values(reservationsAndOrders).filter(
      r => r.eventId.id === selectedEvent.id,
    );
    console.log(reservations);
    if (!reservations) return null;

    return createPortal(
      <FullScreenModal>
        <ScrollContainer>
          <p>
            <Typography type="headline" color={palette.primaryDeep}>
              Vantaa Kulttuuria
              <Typography type="title">Varauslista</Typography>
            </Typography>
            <hr />
          </p>
          <ul>
            {reservations
              .sort((a, b) => {
                return a.name[0] < b.name[0];
              })
              .map(r => (
                <ReservationListItem reservation={r} event={selectedEvent} />
              ))}
          </ul>
        </ScrollContainer>
      </FullScreenModal>,
      document.querySelector('body'),
    );
  }
}

export default withTheme(connect('store')(ReservationList));
