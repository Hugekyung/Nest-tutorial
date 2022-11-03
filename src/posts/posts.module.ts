import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/repository/users.repository';
import { EmailModule } from '@src/email/email.module';
import { PostRepository } from '@src/repository/posts.repository';
import { UsersService } from '@src/users/users.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, UserRepository]), EmailModule, UsersService],
  controllers: [PostsController],
  providers: [PostsService, UsersService],
})
export class PostsModule {}
