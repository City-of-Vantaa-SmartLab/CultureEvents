import React, { Component } from 'react';
import Modal, { Content } from '../../../components/modal';
import Typography from '../../../components/typography';
import { connect } from '../../../utils';
import { withTheme } from 'styled-components';
import Icon from 'antd/lib/icon';

export default withTheme(
  connect('store')(
    class AppModal extends Component {
      state = {
        show: false,
        handledSignalToShow: false,
      };
      constructor(props) {
        super(props);
        if (props.store.ui.auth.validateTokenFailed) {
          this.state = { show: true, handledSignalToShow: true };
          window.setTimeout(() => {
            try {
              this.setState({ show: false });
            } catch (error) {
              console.error(error);
            }
          }, 5000);
        }
      }
      componentWillUpdate() {
        // only show modal if its 0.5s pass waiting.
        // this is to avoid flashing effects
        if (
          this.props.store.ui.auth.validateTokenInProgress &&
          !this.state.handledSignalToShow
        ) {
          this.setState(
            {
              handledSignalToShow: true,
            },
            () => {
              new Promise((resolve, reject) => {
                window.setTimeout(resolve, 300);
              }).then(() => {
                this.setState({
                  show: true,
                });
              });
            },
          );
        }
        if (this.props.store.ui.auth.validateTokenFailed) {
          window.setTimeout(() => {
            try {
              this.setState({ show: false });
            } catch (error) {
              console.error(error);
            }
          }, 5000);
        }
      }
      render() {
        const { auth } = this.props.store.ui;
        const { palette } = this.props.theme;

        const showSignalFromStore =
          auth.validateTokenInProgress || auth.validateTokenFailed;
        return (
          <Modal
            show={showSignalFromStore && this.state.show}
            hideCloseButton={auth.validateTokenInProgress}
            onClear={() => this.setState({ show: false })}
          >
            {auth.validateTokenInProgress ? (
              <Content>
                <Typography type="title" color={palette.primary}>
                  Validating session...{' '}
                  {
                    <Icon
                      type="loading"
                      style={{ fontSize: '1.5rem', marginLeft: '1rem' }}
                    />
                  }
                </Typography>
                <Typography type="body">
                  We are checking if your session is still valid
                </Typography>
              </Content>
            ) : (
              <Content>
                <Typography type="title" color={palette.red}>
                  Your session expired
                </Typography>
                <Typography type="body">
                  You will be redirected to the login page, where you can enter
                  your credentials again
                </Typography>
              </Content>
            )}
          </Modal>
        );
      }
    },
  ),
);
