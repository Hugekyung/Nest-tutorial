import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [UsersModule, ProductsModule],
  providers: [EmailService],
})
export class AppModule {}
