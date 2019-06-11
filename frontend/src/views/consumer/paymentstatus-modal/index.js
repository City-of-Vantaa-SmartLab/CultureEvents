import React from 'react';
import Modal, { Content } from 'components/modal';
import Typography from 'components/typography';
import EventCard from 'components/event-card';
import { connect, parseQuery } from 'utils';
import styled, { withTheme } from 'styled-components';
import { Route } from 'react-router-dom';
import chroma from 'chroma-js';
import {fetchOneEvent} from '../../../apis';
const EventCardWrapper = styled.div`
  background-color: ${props =>
    chroma(props.bgColor)
      .alpha(0.2)
      .css('rgba')};
  border-radius: 0 0 8px 8px;
  width: 100%;
  display: flex;
  padding: 1rem;
`;

export default withTheme(
  connect('store')(
    class PaymentStatusModal extends React.Component {
      state = {
        show: true,
        eventToLoad: null,
      };

      loadEvent = id => {
        fetchOneEvent(id).then(result => this.setState({
            eventToLoad: result,
        }))
      };

      // @TODO: status code be enums constant for easier readability
      // also would be nice to group it into a object instead
      getColor = statusCode => {
        const { red, primary, lightGreen, purple } = this.props.theme.palette;
        if (statusCode == 0) return lightGreen;
        if (statusCode == 1) return red;
        if (statusCode == 2) return primary;
        if (statusCode == 3) return purple;
        if (statusCode == 4) return red;
        return red;
      };
      // @TODO: get translation for these text
      getMeaning = statusCode => {
        if (statusCode == 0) return 'Maksu vahvistettu';
        if (statusCode == 1) return 'Varausta ei löytynyt järjestelmästä';
        if (statusCode == 2) return 'Varaus on jo maksettu';
        if (statusCode == 3) return 'Maksu epäonnistui maksujärjestelmässä';
        if (statusCode == 4) return 'Maksu epäonnistui';
        return 'Tuntematon virhe';
      };
      getMeaningLong = statusCode => {
        if (statusCode == 0)
          return `Kiitos ostostasi! Lähetämme liput antamaasi puhelinnumeroon tekstiviestillä.
          Jos et saa tekstiviestiä, ota yhteys tapahtuman tuottajaan:`;
        // @TODO: Wording to handle this case?
        if (statusCode == 1)
          return `Olemme pahoillamme! Varaus epäonnistui, koska maksua vastaavaa varausta ei löytynyt järjestelmästä`;
        if (statusCode == 2)
          return `Varaus on jo maksettu, joten uutta maksua ei suoritettu. `;
        if (statusCode == 3)
          return 'Olemme pahoillamme! Maksu epäonnistui maksujärjestelmässä, eikä varaus onnistunut.';
        if (statusCode == 4)
          return `Olemme pahoillamme!
          Maksunvälityksessä tapahtui häiriö, eikä
          maksun tekeminen onnistunut.
          `;
        return 'Maksu epäonnistui tuntemattomasta syystä, eikä varausta voitu tehdä. Yritä uudelleen, kiitos.';
      };
      render() {
        const { store } = this.props;

        return (
          <Route
            path="/consumer/payment"
            children={({ match, location }) => {
              const query = parseQuery(location.search);
              this.loadEvent(query.event_id);
              const meaning = match && this.getMeaning(query.status);
              const longText = match && this.getMeaningLong(query.status);
              const foundEvent = match && store.findEvent(query.event_id); // maybe undefined if not found
              const event = foundEvent && foundEvent.toJSON();
              return (
                <Modal
                  show={match && this.state.show}
                  onClear={() => this.setState({ show: false })}
                >
                  <Content>
                    <Typography
                      type="title"
                      color={match && this.getColor(query.status)}
                    >
                      {meaning}
                    </Typography>
                    <Typography style={{ whiteSpace: 'pre-line' }} type="body">
                      {longText}
                    </Typography>
                    <br />
                    {(query.status == 4 || query.status == 0) && event && (
                      <Typography
                        style={{ whiteSpace: 'pre-line' }}
                        type="largebody"
                      >
                        {event.contactInformation}
                      </Typography>
                    )}
                  </Content>
                  {event && query.status == 0 && (
                    <EventCardWrapper bgColor={event.themeColor}>
                      <EventCard mini event={this.state.eventToLoad} />
                    </EventCardWrapper>
                  )}
                </Modal>
              );
            }}
          />
        );
      }
    },
  ),
);
