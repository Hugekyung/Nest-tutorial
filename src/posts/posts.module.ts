import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../repository/users.repository';
import { EmailModule } from '../email/email.module';
import { PostRepository } from '../repository/posts.repository';
import { UsersService } from '../users/users.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, UserRepository]), EmailModule, UsersService],
  controllers: [PostsController],
  providers: [PostsService, UsersService],
})
export class PostsModule {}
