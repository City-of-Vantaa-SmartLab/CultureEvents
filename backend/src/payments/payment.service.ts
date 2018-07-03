import axios from 'axios';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from './payment.entity';
import { Repository } from 'typeorm';
import { BamboraService } from 'services/bambora.service';

const TOKEN_URL = 'https://payform.bambora.com/pbwapi/auth_payment';
const BAMBORA_API_URL = 'https://payform.bambora.com/pbwapi/token/';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payments)
    private readonly paymentRepository: Repository<Payments>,
    private readonly bamboraService: BamboraService,
  ) {}

  async getPaymentRedirectUrl(paymentObj) {
    try {
      const paymentEntity = await this.bamboraService.createPaymentModel(
        paymentObj,
      );
      // Saves the payment request to database
      await this.paymentRepository.save(paymentEntity);
      const paymentRequest = await this.bamboraService.createBamboraPaymentRequest(
        paymentEntity,
      );
      const response = await axios.post(TOKEN_URL, paymentRequest);
      const redirectUrl = BAMBORA_API_URL + response.data.token;
      return redirectUrl;
    } catch (error) {
      console.log(`Failed to get redirect url from bambora: ${error.message}`);
      return null;
    }
  }

  async getPaymentByOrderNumber(orderNumber: string) {
    return await this.paymentRepository.findOne({
      where: { order_number: orderNumber },
    });
  }

  async updatePaymentStatus(orderNumber: string, payment_status: boolean) {
    const payment = await this.getPaymentByOrderNumber(orderNumber);
    payment.payment_status = payment_status;
    this.paymentRepository.save(payment);
  }
}
