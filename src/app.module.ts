import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { PostsModule } from './posts/posts.module';
import { LoggerMiddleware } from 'middlewares/logger.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UsersModule, EmailModule, PostsModule],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*'); //middleware들은 consumer에다가 연결한다!
  }
}
