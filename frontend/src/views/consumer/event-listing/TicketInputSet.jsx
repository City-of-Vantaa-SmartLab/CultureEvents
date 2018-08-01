import React, { Component } from 'react';
import { FlexBoxHorizontal } from './EventBooking';
import { observer } from 'mobx-react';
import { clamp } from 'utils';
import Form, { InputField } from 'components/form';

export default observer(
  class TicketInputSet extends Component {
    findTicketCatalogMaxSeats = id => {
      const catalog = this.props.ticketCatalog.find(elem => elem.id === id);
      if (catalog === undefined) {
        return 0;
      }
      return catalog.maxSeats - catalog.occupiedSeats;
    };
    render() {
      const { tickets, ticketCatalog } = this.props;
      return (
        // @TODO: consider pulling inline functions into methods for easier reasoning, and testing
        <Form>
          {tickets.map((ticket, index) => {
            return (
              <FlexBoxHorizontal key={ticket.id || index}>
                <InputField
                  disabled={ticket.value === false}
                  placeholder="Lipputyppi"
                  value={ticket.label}
                  onChange={value => {
                    ticket.value = Number(value);
                    const origTicketTypeRef = ticketCatalog.find(
                      elem => elem.id === Number(value),
                    );
                    if (!origTicketTypeRef)
                      console.error(
                        `Cannot find original ticket type ${origTicketTypeRef} from id ${value}`,
                      );
                    else ticket.label = origTicketTypeRef.ticketDescription;
                  }}
                  style={{ width: '100%' }}
                  type="select"
                  data={ticketCatalog.map(catalog => {
                    const correspondingCatalog = tickets.find(
                      elem => Number(elem.value) === catalog.id,
                    );
                    return {
                      label: catalog.ticketDescription,
                      value: catalog.id,
                      // option is diabled if it is present in other input
                      // or there is no available seats
                      disabled: correspondingCatalog || !catalog.isAvailable,
                    };
                  })}
                  lightMode
                />
                <InputField
                  lightMode
                  disabled={!ticket.value}
                  type="number"
                  value={ticket.amount}
                  min={0}
                  max={this.findTicketCatalogMaxSeats(ticket.value)}
                  defaultValue={0}
                  onChange={(
                    value, // update amount of booking. Clamped to 0 and max number of seat
                  ) =>
                    (ticket.amount = clamp(
                      0,
                      this.findTicketCatalogMaxSeats(ticket.value),
                    )(value))
                  }
                />
              </FlexBoxHorizontal>
            );
          })}
        </Form>
      );
    }
  },
);
