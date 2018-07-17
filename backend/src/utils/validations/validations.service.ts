import { Injectable } from '@nestjs/common';

const VANTA_ORDER_PREFIX = process.env.VANTA_ORDER_PREFIX || 'vantaa-order-';
const ORDER_NUMBER_REGEX = '^\\d+$';

@Injectable()
export class ValidationService {
  validateId(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      return 'Id is not valid';
    }
  }

  validateAmount(amount: number) {
    if (typeof amount !== 'number' || isNaN(amount) || amount > 50) {
      return 'Amount is not valid';
    }
  }

  validatePaymentRedirectRequest(id: number, amount: number) {
    const validateId = this.validateId(id);
    if (validateId) {
      return validateId;
    } else {
      return this.validateAmount(amount);
    }
  }

  validateOrderNumber(orderNumber: any) {
    try {
      const order_number = orderNumber.split(VANTA_ORDER_PREFIX)[1];

      if (
        !order_number ||
        typeof order_number !== 'string' ||
        orderNumber.length === 0 ||
        !order_number.match(ORDER_NUMBER_REGEX)
      ) {
        return 'Order number is not valid';
      }
    } catch (error) {
      return `Invalid order number ${error.message}`;
    }
  }
}
