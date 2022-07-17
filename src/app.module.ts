import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [UsersModule],
  providers: [EmailService],
})
export class AppModule {}
