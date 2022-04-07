import { BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';

class Iamport {
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
  }
}