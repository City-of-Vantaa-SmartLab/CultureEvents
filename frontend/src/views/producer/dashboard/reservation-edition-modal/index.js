import React from 'react';
import Button from 'components/button';
import Modal, { Content, ActionBar } from 'components/modal';
import Typography from 'components/typography';
import { withTheme } from 'styled-components';
import BookerInformation from './BookerInformation';
import EditReservationDetailForm from './EditReservationDetailForm';
import { connect } from 'utils';
import { observable } from 'mobx';

class ReservationEditionModal extends React.Component {
  componentWillReceiveProps(nextProps) {
    this._state = observable(
      nextProps.store.selectedReservation.tickets.map(ticket => {
        const correspondingCatalog = nextProps.store.selectedEvent.ticketCatalog
          .toJSON()
          .find(cat => cat.id === ticket.priceId);
        const { maxSeats, occupiedSeats } = correspondingCatalog;

        return {
          id: ticket.priceId,
          maxSeats,
          occupiedSeats,
          ticketName: correspondingCatalog.ticketDescription,
          reservedSeats: ticket.noOfTickets,
        };
      }),
    );
  }

  render() {
    const { theme, store } = this.props;
    const { selectedEvent, selectedReservation } = store;
    const { orderAndPayment } = store.ui;

    return (
      <Modal show={orderAndPayment.editionModelShown} onClear={store.ui.orderAndPayment.toggleEditionModal}>
        {selectedEvent &&
          selectedReservation && [
            <Content>
              <Typography type="title">Modify Reservation</Typography>
              <BookerInformation
                name={selectedReservation.name}
                school={selectedReservation.schoolName}
                classRoom={selectedReservation.class}
                phoneNumber={selectedReservation.phoneNumber}
                email={selectedReservation.email}
              />
            </Content>,
            <EditReservationDetailForm formState={this._state} />,
          ]}
        <ActionBar>
          <Button backgroundColor="white" onClick={store.ui.orderAndPayment.toggleEditionModal}>
            Quit and do nothing
          </Button>
          <Button backgroundColor={theme.palette.primaryDeep} onClick={() => store.submitReservationPatch(this._state)}>
            Confirm changes
          </Button>
        </ActionBar>
      </Modal>
    );
  }
}

export default withTheme(connect('store')(ReservationEditionModal));
