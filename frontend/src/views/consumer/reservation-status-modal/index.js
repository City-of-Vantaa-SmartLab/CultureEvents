import React, { Component } from 'react';
import Modal, { Content } from '../../../components/modal';
import Typography from '../../../components/typography';
import { connect } from '../../../utils';
import styled, { withTheme } from 'styled-components';
import Icon from 'antd/lib/icon';
import EventCard from '../../../components/event-card';
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
    class RedirectModal extends Component {
      render() {
        const { orderAndPayment } = this.props.store.ui;
        const { palette } = this.props.theme;
        const { selectedEvent } = this.props.store;
        return (
          <Modal
            show={orderAndPayment.reservationStatus > 1}
            onClear={orderAndPayment.clearReservationFlag}
          >
            {orderAndPayment.reservationStatus == 2 && (
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
                {
                  // have a card visualization here
                  // to let user see what they reserved
                }
              </Content>
            )}
          </Modal>
        );
      }
    },
  ),
);
