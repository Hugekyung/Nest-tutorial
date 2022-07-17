import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('sendMemberJoinVerification : email 주소와 signupVerifyToken을 받아 가입 인증용 이메일을 발송한다.', async () => {
    service.transporter.sendMail = jest.fn();
    const spy = jest.spyOn(service.transporter, 'sendMail');
    const email = 'test@mail.com';
    const signupVerifyToken = 'test-token';
    await service.sendMemberJoinVerification(email, signupVerifyToken);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
