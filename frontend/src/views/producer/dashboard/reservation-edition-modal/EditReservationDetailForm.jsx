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
  // in

  render() {
    const { theme, formState } = this.props;

    return (
      <Wrapper>
        <Typography type="largebody" color={theme.palette.primaryDeep}>
          Edit reservation details
        </Typography>
        {this.formState.map(ticket => {
          return <TicketFormRow key={ticket.id} ticket={ticket} />;
        })}
      </Wrapper>
    );
  }
}

const TicketFormRow = withTheme(
  observer(({ theme, ticket }) => (
    <Row>
      <TicketLabelGroup>
        <Typography type="largebody">{ticket.ticketName}</Typography>
        <TagPill highlightColor={theme.palette.orange} selected color={'white'}>
          {ticket.maxSeats - ticket.occupiedSeats} seats
        </TagPill>
      </TicketLabelGroup>
      <InputField
        type="number"
        min={0}
        max={ticket.maxSeats - ticket.occupiedSeats}
        value={ticket.reservedSeats}
        onChange={v => {
          ticket.reservedSeats = v;
        }}
      />
    </Row>
  )),
);

export default withTheme(EditReservationDetail);
