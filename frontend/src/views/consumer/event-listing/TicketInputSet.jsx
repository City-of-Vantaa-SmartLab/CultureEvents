import React, { Component } from 'react';
import { FlexBoxHorizontal } from './EventBooking';
import { observer } from 'mobx-react';
import { clamp } from '../../../utils';
import Form, { InputField } from '../../../components/form';

export default observer(
  class TicketInputSet extends Component {
    findTicketCatalogMaxSeats = id => {
      const catalog = this.props.ticketCatalog.find(elem => elem.id == id);
      if (catalog == undefined) {
        return 0;
      }
      return catalog.availableSeatForThisType;
    };
    render() {
      const { tickets, ticketCatalog } = this.props;
      return (
        <Form>
          {tickets.map((ticket, index) => (
            <FlexBoxHorizontal key={ticket.id || index}>
              <InputField
                placeholder="Lipputyppi"
                value={ticket.label}
                onChange={value => {
                  ticket.value = value + '';
                  const origTicketTypeRef = ticketCatalog.find(
                    elem => elem.id == value,
                  );
                  if (!origTicketTypeRef)
                    console.error(
                      'Cannot find original ticketType',
                      origTicketTypeRef,
                      'from id, ',
                      value,
                    );
                  else ticket.label = origTicketTypeRef.ticketDescription;
                }}
                style={{ width: '100%' }}
                type="select"
                data={ticketCatalog.map(catalog => ({
                  label: catalog.ticketDescription,
                  value: catalog.id,
                  // option is diabled if it is present in other input
                  disabled: tickets.find(elem => elem.value === catalog.id),
                }))}
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
          ))}
        </Form>
      );
    }
  },
);
