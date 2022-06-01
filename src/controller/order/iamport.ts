import { BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';

export class Iamport {
  async getIamportToken() {
    if (!process.env.IAMPORT_KEY) {
      throw new NotFoundException('iamport key error');
    }

    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IAMPORT_KEY, // REST API 키
        imp_secret: process.env.IAMPORT_SECRET // REST API Secret
      }
    });
    if (!getToken && !getToken.data) {
      throw new BadRequestException('iamport token error');
    }

    const { access_token } = getToken.data.response; // 인증 토큰

    return access_token;
  }

  async getPaymentData(imp_uid,access_token) {
  //   imp_uid 로 아임포트 서버에서결제 정보 조회
    const url = `https://api.iamport.kr/payments/${imp_uid}`;
    const headers = {
      Authorization: access_token,
    };

    const getPaymentData = await axios({
      url: url,
      method: 'get',
      headers : headers,
    });
    const paymentData = getPaymentData.data.response; // 조회한 결제 정보
    if(!paymentData) {
      throw new BadRequestException('does not found payment info');
    }

    return paymentData;
  }
}