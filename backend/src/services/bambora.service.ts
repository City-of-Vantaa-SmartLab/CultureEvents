import * as crypto from 'crypto';

const payment_return_url = process.env.PAYMENT_RETURN_URL;
const payemnt_notify_url = process.env.PAYMENT_NOTIFY_URL;

const secret = process.env.BAMBORA_SECRET_KEY;
const apiKey = process.env.BAMBORA_API_KEY;

const bamboraProductID = process.env.BAMBORA_PRODUCT_ID;
const bamboraProductTitle = process.env.BAMBORA_PRODUCT_TITLE;

const BAMBORA_TAX = process.env.BAMBORA_TAX || 0;

const VANTA_ORDER_PREFIX = process.env.VANTA_ORDER_PREFIX || 'vantaa-order-';

export class BamboraService {
  createPaymentModel(paymentModel) {
    const orderNumber = VANTA_ORDER_PREFIX + Date.now();
    const message = apiKey + '|' + orderNumber;
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
    const bamboraTax = Number(BAMBORA_TAX);
    let preTaxAmount = amount;
    if (bamboraTax) {
      preTaxAmount = Math.round(
        Number(
          ((amount * Number(BAMBORA_TAX)) / (Number(BAMBORA_TAX) + 1)).toFixed(2),
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
          tax: bamboraTax,
          price: amount,
          type: 1,
        },
      ],
    };
  }
}
