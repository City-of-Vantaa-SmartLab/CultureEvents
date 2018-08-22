import React from 'react';
import Modal, { Content } from 'components/modal';
import Typography from 'components/typography';
import { withTheme } from 'styled-components';

class WelcomeModal extends React.Component {
  state = {
    dontShow:
      JSON.parse(window.localStorage.getItem('dontShowWelcomeMessage')) ===
      true,
  };
  componentDidMount() {}
  onClear = e => {
    this.setState({ dontShow: true });
    window.localStorage.setItem('dontShowWelcomeMessage', 'true');
  };
  render() {
    return (
      <Modal show={!this.state.dontShow} onClear={this.onClear}>
        <Content>
          <Typography type="title" color={this.props.theme.palette.primaryDeep}>
            Tervetuloa
          </Typography>
          <Typography
            type="body"
            style={{ marginBottom: '1rem', display: 'block' }}
          >
            Tällä palvelulla voit ostaa ja varata lippuja Vantaan
            kulttuuripalveluiden lastenkulttuuritilaisuuksiin.
          </Typography>
          <Typography type="largebody">
            Lisää tapahtumia löydät osoitteesta:{' '}
            <a href="vantaa.fi/lastenkulttuuri">vantaa.fi/lastenkulttuuri</a>
          </Typography>
        </Content>
      </Modal>
    );
  }
}

export default withTheme(WelcomeModal);
