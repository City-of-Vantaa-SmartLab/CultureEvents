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
        countDown: 5,
      };
      componentDidUpdate() {
        // if the signal is handled, do nothing
        if (this.state.redirectingLocally) return;
        // when there is a redirecting signal from state, this components initiate a countdown
        // when the countdown hits 0, it will redirect
        if (this.props.store.ui.orderAndPayment.redirecting) {
          console.log('Handling redirect signal');
          this.setState(
            {
              countDown: 5,
              redirectingLocally: true, // mark that the signal has been handled.
            },
            () => {
              this.interval = window.setInterval(() => {
                this.setState({
                  countDown: this.state.countDown - 1,
                });
              }, 1000);
            },
          );
        }
      }
      componentWillUnmount() {
        window.clearInterval(this.interval);
      }
      render() {
        const { orderAndPayment } = this.props.store.ui;
        const { palette } = this.props.theme;

        if (this.state.countDown < 1) {
          window.clearInterval(this.interval);
          window.location.replace(orderAndPayment.redirectUrl);
        }

        return (
          <Modal
            show={orderAndPayment.pending}
            onClear={orderAndPayment.clearOrderPendingFlag}
          >
            {orderAndPayment.redirecting ? (
              <Content>
                <Typography type="title" color={palette.primaryDark}>
                  Redirecting{' '}
                  {
                    <Icon
                      type="loading"
                      style={{ fontSize: '1.5rem', marginLeft: '1rem' }}
                    />
                  }
                </Typography>
                <Typography type="body">
                  Bambora is our payment service.{' '}
                </Typography>
                {this.state.countDown > 0 ? (
                  <Typography type="body">
                    Redirecting you in{' '}
                    {
                      <Typography type="body" color={palette.red}>
                        {this.state.countDown}
                      </Typography>
                    }{' '}
                    seconds
                  </Typography>
                ) : (
                  <Typography type="body">Redirection in progress</Typography>
                )}
              </Content>
            ) : (
              <Content>
                <Typography type="title" color={palette.primaryDark}>
                  Please wait
                  {
                    <Icon
                      type="loading"
                      style={{ fontSize: '1.5rem', marginLeft: '1rem' }}
                    />
                  }
                </Typography>
                <Typography type="body">
                  Waiting for our server to process your order
                </Typography>
              </Content>
            )}
          </Modal>
        );
      }
    },
  ),
);
