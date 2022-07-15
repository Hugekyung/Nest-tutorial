import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendMemberJoinVerification(email: string, signupVerifyToken: string) {}
}
