import React from 'react';
import styled, { withTheme } from 'styled-components';
import chroma from 'chroma-js';
import Typography from 'components/typography';
import { InputField } from 'components/form';
import { TagPill } from 'components/tag-pill';
import { observer } from 'mobx-react';

const Wrapper = styled.div`
  padding: 2rem;
  margin-bottom: 1rem;
  background-color: ${props =>
    chroma(props.theme.palette.primaryDeep)
      .alpha(0.3)
      .css('rgba')};
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TicketLabelGroup = styled.div`
  p,
  span {
    margin-right: 1rem;
  }
`;

class EditReservationDetail extends React.Component {
  render() {
    const { theme, formState } = this.props;

    return (
      <Wrapper>
        <Typography type="largebody" color={theme.palette.primaryDeep}>
          Edit reservation details
        </Typography>
        {formState.map(ticket => {
          return (
            <TicketFormRow
              key={ticket.id}
              ticket={ticket}
              orginalTickets={ticket.reservedSeats}
            />
          );
        })}
      </Wrapper>
    );
  }
}

const TicketFormRow = withTheme(
  observer(({ theme, ticket, orginalTickets }) => {
    return (
      <Row>
        <TicketLabelGroup>
          <Typography type="largebody">{ticket.ticketName}</Typography>
          Booked{' '}
          <TagPill
            highlightColor={
              ticket.reservedSeats + (ticket.occupiedSeats - orginalTickets) >
                ticket.maxSeats || ticket.reservedSeats < 0
                ? theme.palette.red
                : theme.palette.orange
            }
            selected
            color={'green'}
          >
            {ticket.reservedSeats ? ticket.reservedSeats : 0} seats
          </TagPill>
          Available{' '}
          <TagPill
            highlightColor={
              ticket.maxSeats -
                ticket.occupiedSeats -
                (ticket.reservedSeats - orginalTickets) >
              0
                ? theme.palette.lightGreen
                : theme.palette.red
            }
            selected
            color={'white'}
          >
            {ticket.maxSeats -
              ticket.occupiedSeats -
              (ticket.reservedSeats - orginalTickets)}{' '}
            more seats
          </TagPill>
        </TicketLabelGroup>
        <InputField
          type="number"
          min={0}
          max={ticket.maxSeats - ticket.occupiedSeats + orginalTickets}
          value={ticket.reservedSeats}
          onChange={value => {
            ticket.reservedSeats = value;
          }}
        />
      </Row>
    );
  }),
);

export default withTheme(EditReservationDetail);
