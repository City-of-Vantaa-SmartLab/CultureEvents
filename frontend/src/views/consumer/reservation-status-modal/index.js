import React, { Component } from 'react';
import Modal, { Content } from '../../../components/modal';
import Typography from '../../../components/typography';
import { connect } from '../../../utils';
import styled, { withTheme } from 'styled-components';
import Icon from 'antd/lib/icon';
import EventCard from '../../../components/event-card';
import chroma from 'chroma-js';
import { Redirect } from 'react-router-dom';

const EventCardWrapper = styled.div`
  background-color: ${props =>
    chroma(props.bgColor)
      .alpha(0.2)
      .css('rgba')};
  border-radius: 0 0 8px 8px;
  width: 100%;
  display: flex;
`;

export default withTheme(
  connect('store')(
    class RedirectModal extends Component {
      componentDidUpdate() {
        if (this.props.store.ui.orderAndPayment.reservationStatus == 2)
          this.props.store.deselectEvent();
      }
      render() {
        const { orderAndPayment } = this.props.store.ui;
        const { palette } = this.props.theme;
        return (
          <Modal
            show={orderAndPayment.reservationStatus > 1}
            onClear={orderAndPayment.clearReservationFlag}
          >
            {orderAndPayment.reservationStatus == 2 && (
              <React.Fragment>
                <Content>
                  <Typography type="title" color={palette.deepGreen}>
                    Varaus vahvistettu
                    {
                      <Icon
                        type="check"
                        style={{ fontSize: '1.5rem', marginLeft: '1rem' }}
                      />
                    }
                  </Typography>
                  <Typography type="body">
                    Kiitos varauksestasi! Lähetämme varaustiedot antamaasi
                    puhelinnumeroon tekstiviestillä.
                  </Typography>
                  <Redirect to="/consumer" />
                </Content>
                {orderAndPayment.reservedEvent && (
                  <EventCardWrapper
                    bgColor={orderAndPayment.reservedEvent.themeColor}
                  >
                    <EventCard mini event={orderAndPayment.reservedEvent} />
                  </EventCardWrapper>
                )}
              </React.Fragment>
            )}
            {orderAndPayment.reservationStatus == 3 && (
              <Content>
                <Typography type="title" color={palette.red}>
                  Varaus epäonnistui
                  {
                    <Icon
                      type="close"
                      style={{ fontSize: '1.5rem', marginLeft: '1rem' }}
                    />
                  }
                </Typography>
                <Typography type="body">
                  Paikkoja ei ole jäljellä riittävästi varauksesi tekemiseen
                </Typography>
                {
                  // have a card visualization here
                  // insert a sorrowful image to show how sorry we are
                }
              </Content>
            )}
          </Modal>
        );
      }
    },
  ),
);
