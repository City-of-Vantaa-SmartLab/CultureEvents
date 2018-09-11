import React from 'react';
import Button from 'components/button';
import Modal, { Content } from 'components/modal';
import Typography from 'components/typography';
import { withTheme } from 'styled-components';

class ReservationEditionModal extends React.Component {
  render() {
    const { theme } = this.props;

    return (
      <Modal show={true}>
        <Content>
          <Typography type="title">Reservation Edition</Typography>
          <Typography type="body">Hello</Typography>
        </Content>
      </Modal>
    );
  }
}

export default withTheme(ReservationEditionModal);
