import React from 'react';
import Modal, { Content } from '../../../components/modal';
import Typography from '../../../components/typography';
import EventCard from '../../../components/event-card';
import { connect, parseQuery } from '../../../utils';
import styled, { withTheme } from 'styled-components';
import { Route } from 'react-router-dom';
import chroma from 'chroma-js';

const EventCardWrapper = styled.div`
  background-color: ${props =>
    chroma(props.bgColor)
      .alpha(0.2)
      .css('rgba')};
  padding: 2rem;
  border-radius: 0 0 8px 8px;
`;

export default withTheme(
  connect('store')(
    class PaymentStatusModal extends React.Component {
      state = {
        show: true,
      };
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
        if (statusCode == 1) return 'Payment not in system';
        if (statusCode == 2) return 'Already paid';
        if (statusCode == 3) return 'Bambora failure';
        if (statusCode == 4) return 'Maksu epäonnistui';
        return 'Unknown Error';
      };
      getMeaningLong = statusCode => {
        if (statusCode == 0)
          return `Kiitos ostostasi! Lähetämme liput antamaasi 
        puhelinnumeroon tekstiviestillä.`;
        // @TODO: Wording to handle this case?
        if (statusCode == 1)
          return `It seems like you have stumbled upon a weird error. Please let our engineer know what happened`;
        if (statusCode == 2)
          return `You already paid for this event. The order that you requested are therefore not fulfilled. You have not been charge anything.`;
        if (statusCode == 3)
          return 'Our third party payment system seemed to have a problem at the moment. Your order have not been fulfilled. We are sorry for this inconvenience.';
        if (statusCode == 4)
          return `Olemme pahoillamme!
          Maksunvälityksessä tapahtui häiriö, eikä
          maksun tekeminen onnistunut.
          `;
        return 'Some thing strange happened and we could not fulfill your order. Please try again.';
      };
      render() {
        return (
          <Route
            path="/consumer/payment"
            children={({ match, location }) => {
              const query = parseQuery(location.search);
              const meaning = match && this.getMeaning(query.status);
              const longText = match && this.getMeaningLong(query.status);
              const event = this.props.store.events.toJSON()[query.event_id];
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
                    {query.status == 4 &&
                      event && (
                        <Typography
                          style={{ whiteSpace: 'pre-line' }}
                          type="largebody"
                          color={this.props.theme.palette.primaryDeep}
                        >
                          {event.contactInformation}
                        </Typography>
                      )}
                  </Content>
                  {event &&
                    query.status == 0 && (
                      <EventCardWrapper bgColor={event.themeColor}>
                        <EventCard mini event={event} />
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
