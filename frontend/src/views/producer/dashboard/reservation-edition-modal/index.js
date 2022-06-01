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
  UNSAFE_componentWillUpdate() {
    if (
      !this.props.store.selectedReservation ||
      !this.props.store.selectedEvent
    )
      return;

    this._state = observable(
      this.props.store.selectedReservation.tickets.map(ticket => {
        const correspondingEvent = this.props.store.findEvent(
          this.props.store.selectedReservation.eventId,
        );

        const correspondingCatalog = correspondingEvent.ticketCatalog
          .toJSON()
          .find(cat => cat.id === ticket.priceId);
        const { maxSeats, occupiedSeats } = correspondingCatalog;

        return {
          id: ticket.id,
          priceId: ticket.priceId,
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
      <Modal
        show={orderAndPayment.editionModelShown}
        onClear={store.ui.orderAndPayment.toggleEditionModal}
      >
        {selectedEvent &&
          selectedReservation &&
          orderAndPayment.editionStatus === 0 && [
            <Content key="content">
              <Typography type="title">Muokkaa varausta</Typography>
              <BookerInformation
                name={selectedReservation.name}
                school={selectedReservation.schoolName}
                classRoom={selectedReservation.class}
                phoneNumber={selectedReservation.phoneNumber}
                email={selectedReservation.email}
              />
            </Content>,
            <EditReservationDetailForm key="form" formState={this._state} />,
            <ActionBar key="actionbar">
              <Button backgroundColor="white" onClick={store.ui.orderAndPayment.toggleEditionModal}>
                Poistu tallentamatta muutoksia
              </Button>
              <Button
                backgroundColor={theme.palette.primaryDeep}
                onClick={() =>
                  store.submitReservationPatch(
                    selectedReservation.id,
                    this._state,
                  )
                }
              >
                Tallenna muutokset
              </Button>
            </ActionBar>,
          ]}
        {orderAndPayment.editionStatus === 2 && (
          <Content>
            <Typography type="title" color={theme.palette.lightGreen}>
              Tallennus onnistui
            </Typography>
            <Typography type="body">Muutokset varaukseen on tallennettu onnistuneesti.</Typography>
          </Content>
        )}
        {orderAndPayment.editionStatus === 3 && (
          <Content>
            <Typography type="title" color={theme.palette.red}>
              Tallennus epäonnistui
            </Typography>
            <Typography type="body">
              Tallennus epäonnistui. Yritä uudelleen ja ota tarvittaessa yhteys ylläpitoon.
            </Typography>
          </Content>
        )}
      </Modal>
    );
  }
}

export default withTheme(connect('store')(ReservationEditionModal));
