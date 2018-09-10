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

    if (status === 1) return `Oletko varma?`;
    if (status === 2) return `Hetkinen...`;
    if (status === 3) return `Tapahtuminen poistettu`;
    if (status === 4) return `Virhe. Ei voi poistaa`;
  }
  getBody() {
    const status = this.props.store.ui.eventList.deleteEventStatus;

    if (status === 1) return `Poista tämä tapahtuma. Toimenpide on pysyvä`;
    if (status === 2) return `Pyrimme siihen...`;
    if (status === 3)
      return `Se on tehty. Et voi enää nähdä vanhaa tapahtumaa.`;
    if (status === 4) return `Voi ei. Jokin asia väärin tapahtui`;
  }
  render() {
    const { store, theme } = this.props;
    const status = store.ui.eventList.deleteEventStatus;

    return (
      <Modal show={status > 0} onClear={store.ui.eventList.clearDeletionFlag}>
        <Content>
          <Typography
            type="title"
            color={status !== 3 ? theme.palette.red : theme.palette.deepGreen}
          >
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
            <Button
              backgroundColor="white"
              onClick={store.ui.eventList.clearDeletionFlag}
            >
              No, I change my mind
            </Button>
            <Button
              backgroundColor={theme.palette.red}
              onClick={() => store.deleteEvent(store.selectedEvent.id)}
            >
              Yes, delete this
            </Button>
          </ActionBar>
        )}
      </Modal>
    );
  }
}
export default withTheme(connect('store')(DeleteConfrimationModal));
