import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {TossPayQueryDto} from "../controller/order/order.controller.dto/tossPaymentsRequest.dto";

@Injectable()
export class TossPayService {
  constructor() {}
  tossUrl = 'https://api.tosspayments.com/v1/payments/';
  async orderPaymentComplete(tossPayQueryDto: TossPayQueryDto) {
    console.log('tossPayQueryDto', tossPayQueryDto);

    const { orderId, amount, paymentKey } = tossPayQueryDto;
    try {
      const pay = await axios.post(
        this.tossUrl + paymentKey,
        {
          orderId: orderId,
          amount: amount,
        },
        {
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(process.env.TOSS_TEST_KEY + ':').toString('base64'),
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('pay', pay);
      return {
        title: '성공적으로 구매했습니다',
        // amount: response.body.totalAmount,
      };
    } catch (e) {
      console.log('토스 페이먼츠 에러 코드', e);
    }
  }
}