import React, { Component } from 'react';
import Modal, { Content } from 'components/modal';
import Typography from 'components/typography';
import { connect } from 'utils';
import { withTheme } from 'styled-components';
import Icon from 'antd/lib/icon';
import ReactHtmlParser from 'react-html-parser';
import './style.css';

export default withTheme(
  connect('store')(
    class PaymentProvidersModal extends Component {
      render() {
        const { orderAndPayment } = this.props.store.ui;
        const { palette } = this.props.theme;

        const createPaymentProvidersList = (providers) =>
            providers.map(p =>
              `<form method='POST' action=${p.url}>
                 ${p.parameters.map(param =>
                  `<input type='hidden' name='${param.name}' value='${param.value}' />`
                 ).join('\n')}
                 <button class='provider-button' type='submit' aria-label='${p.name}'><img src='${p.svg}' /></button>
               </form>`
            ).join('\n');

        return (
          <Modal
            show={orderAndPayment.redirectStatus > 0}
            onClear={() => {
              orderAndPayment.clearOrderPendingFlag();
            }}
          >
            {orderAndPayment.redirectStatus === 2 && (
              <Content>
                <Typography type="title" color={palette.primaryDark}>
                  Valitse maksutapa{' '}
                </Typography>
                <Typography type="body">
                  {ReactHtmlParser(createPaymentProvidersList(JSON.parse(orderAndPayment.paymentProviders)))}
                </Typography>
              </Content>
            )}

            {orderAndPayment.redirectStatus === 1 && (
              <Content>
                <Typography type="title" color={palette.primaryDark}>
                  Odota, kiitos
                  {
                    <Icon
                      type="loading"
                      style={{ fontSize: '1.5rem', marginLeft: '1rem' }}
                    />
                  }
                </Typography>
                <Typography type="body">
                  Käsittelemme tilaustasi. Jos sait jo vahvistustekstiviestin, kaikki on valmista ja voit sulkea ikkunan.
                </Typography>
              </Content>
            )}
            {orderAndPayment.redirectStatus === 3 && (
              <Content>
                <Typography type="title" color={palette.red}>
                  Varausta ei voitu tehdä
                </Typography>
                <Typography type="body">
                  Varausta ei voitu tehdä. Tämä voi johtua siitä, että vapaita paikkoja ei ollut tarpeeksi.
                </Typography>
              </Content>
            )}
          </Modal>
        );
      }
    },
  ),
);
