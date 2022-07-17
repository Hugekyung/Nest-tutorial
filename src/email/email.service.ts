import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { EmailOptions } from './types/email.interface';

@Injectable()
export class EmailService {
  transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendMemberJoinVerification(email: string, signupVerifyToken: string) {
    const baseUrl = 'http://localhost:3000';
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    const mailOptions: EmailOptions = {
      to: email,
      subject: '가입 인증 메일',
      html: `
            가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
            <form action="${url}" method="POST">
            <button>가입확인</button>
            </form>
        `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
