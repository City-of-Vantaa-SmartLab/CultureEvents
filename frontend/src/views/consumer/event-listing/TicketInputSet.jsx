import React, { Component } from 'react';
import Typography from 'components/typography';
import { FlexBoxHorizontal } from './EventBooking';
import { observer } from 'mobx-react';
import { clamp } from 'utils';
import Form, { InputField } from 'components/form';

export default observer(
  class TicketInputSet extends Component {
    onChange = (catalog, correspondingTicket) => amount => {
      if (correspondingTicket) {
        correspondingTicket.amount = clamp(0, catalog.maxSeats)(amount);
      } else {
        this.props.tickets.push({
          value: catalog.id,
          amount: clamp(0, catalog.maxSeats)(amount),
        });
      }
    };

    render() {
      const { tickets, ticketCatalog, themeColor } = this.props;

      return (
        <Form>
          {ticketCatalog.map((catalog, index) => {
            const correspondingTicket = tickets.find(
              t => t.value === catalog.id,
            );
            return (
              <FlexBoxHorizontal
                style={{ justifyContent: 'space-between', marginTop: 0 }}
                key={catalog.id}
              >
                <Typography type="largebody" color={themeColor}>
                  {catalog.ticketDescription}
                </Typography>
                <InputField
                  lightMode
                  disabled={!catalog.isAvailable}
                  type="number"
                  value={correspondingTicket ? correspondingTicket.amount : 0}
                  min={0}
                  max={catalog.maxSeats}
                  defaultValue={0}
                  onChange={this.onChange(catalog, correspondingTicket)}
                />
              </FlexBoxHorizontal>
            );
          })}
        </Form>
      );
    }
  },
);
