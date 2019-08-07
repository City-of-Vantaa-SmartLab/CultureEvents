import * as crypto from 'crypto';

const payment_return_url = 'http://kulttuuriliput-dev.eu-west-1.elasticbeanstalk.com/api/payments/payment-return';
const payemnt_notify_url = 'http://kulttuuriliput-dev.eu-west-1.elasticbeanstalk.com/api/payments/payment-notify';

const secret = '1ea00e5acc49440dfc514ababb3252c7';
const apiKey = '2992d674acd5b09aed5063180c4c87cbdbce';

const bamboraProductID = '327554_163330200_M0';
const bamboraProductTitle = 'Saldovaraus Jumppaliput-sovellukseen';

const BAMBORA_TAX = Number(process.env.BAMBORA_TAX) || 0;

const VANTA_ORDER_PREFIX = process.env.VANTA_ORDER_PREFIX || 'vantaa-order-';

export class BamboraService {

  createPaymentModel(paymentModel) {
    console.log('process.env', process.env);
    console.log('BAMBORA_API_KEY', process.env.BAMBORA_API_KEY);
    console.log('BAMBORA_PRODUCT_ID', process.env.BAMBORA_PRODUCT_ID);
    console.log('BAMBORA_PRODUCT_TITLE', process.env.BAMBORA_PRODUCT_TITLE);
    console.log('BAMBORA_SECRET_KEY', process.env.BAMBORA_SECRET_KEY);
    console.log('PAYMENT_NOTIFY_URL', process.env.PAYMENT_NOTIFY_URL);
    console.log('PAYMENT_RETURN_URL', process.env.PAYMENT_RETURN_URL);
    const orderNumber = VANTA_ORDER_PREFIX + Date.now();
    console.log('orderNumber', orderNumber);
    console.log('apiKey', apiKey);
    console.log('secret', secret);

    const message = apiKey + '|' + orderNumber;
    console.log('message', message);
    const authCode = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex')
      .toUpperCase();

    paymentModel.auth_code = authCode;
    paymentModel.order_number = orderNumber;
    paymentModel.payment_status = false;
    paymentModel.payment_date = new Date();
    return paymentModel;
  }

  createBamboraPaymentRequest(paymentModel) {
    const amount = paymentModel.amount * 100;
    let preTaxAmount = amount;
    try {
      if (BAMBORA_TAX) {
        preTaxAmount = Math.round(
          Number(
            ((amount * BAMBORA_TAX) / (BAMBORA_TAX + 1)).toFixed(2),
          ),
        );
      }
      return {
        version: 'w3.1',
        api_key: apiKey,
        order_number: paymentModel.order_number,
        amount: amount,
        currency: 'EUR',
        payment_method: {
          type: 'e-payment',
          return_url: payment_return_url,
          notify_url: payemnt_notify_url,
          lang: 'fi',
          selected: ['banks', 'creditcards'],
        },
        authcode: paymentModel.auth_code,
        customer: {
          firstname: paymentModel.username,
        },
        products: [
          {
            id: bamboraProductID,
            title: bamboraProductTitle,
            count: 1,
            pretax_price: preTaxAmount,
            tax: BAMBORA_TAX,
            price: amount,
            type: 1,
          },
        ],
      };
    } catch (error) {
      console.error('failed to create Bambora Payment Request', error);
    }

  }
}
