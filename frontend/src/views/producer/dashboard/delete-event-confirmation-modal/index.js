import React from 'react';
import styled, { withTheme } from 'styled-components';
import { connect } from 'utils';
import Modal, { Content, ActionBar } from 'components/modal';
import Typography from 'components/typography';
import Button from 'components/button';
import EventCard from 'components/event-card';

const Centerizer = styled.div`
  padding: 2rem;
  display: flex;

  & > * {
    margin: auto;
  }
`;

class DeleteConfrimationModal extends React.Component {
  getTitle() {
    const status = this.props.store.ui.eventList.deleteEventStatus;

    if (status === 1) return `Haluatko varmasti poistaa tapahtuman?`;
    if (status === 2) return `Odota hetki...`;
    if (status === 3) return `Tapahtuma poistettu onnistuneesti`;
    if (status === 4) return `Virhe. Tapahtumaa ei voitu poistaa`;
  }
  getBody() {
    const status = this.props.store.ui.eventList.deleteEventStatus;

    if (status === 1)
      return `Tapahtuman poistaminen poistaa koko tapahtuman ja siihen liittyvät varaukset. Haluatko varmasti poistaa tapahtuman?`;
    if (status === 2) return ``;
    if (status === 3) return ``;
    if (status === 4)
      return `Tapahtuman poistaminen epäonnistui. Yritä uudelleen ja ota tarvittaessa yhteyttä sovelluksen ylläpitoon.`;
  }
  render() {
    const { store, theme } = this.props;
    const status = store.ui.eventList.deleteEventStatus;

    return (
      <Modal show={status > 0} onClear={store.ui.eventList.clearDeletionFlag}>
        <Content>
          <Typography type="title" color={status !== 3 ? theme.palette.red : theme.palette.deepGreen}>
            {this.getTitle()}
          </Typography>
          <Typography type="body">{this.getBody()}</Typography>
          {status === 1 && (
            <Centerizer>
              <EventCard mini={true} event={store.selectedEvent} />
            </Centerizer>
          )}
        </Content>
        {status === 1 && (
          <ActionBar>
            <Button backgroundColor="white" onClick={store.ui.eventList.clearDeletionFlag}>
              En ole varma, keskeytä poistaminen
            </Button>
            <Button backgroundColor={theme.palette.red} onClick={() => store.deleteEvent(store.selectedEvent.id)}>
              Olen varma, poista tapahtuma
            </Button>
          </ActionBar>
        )}
      </Modal>
    );
  }
}
export default withTheme(connect('store')(DeleteConfrimationModal));
