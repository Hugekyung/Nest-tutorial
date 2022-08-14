import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { PostRepository } from 'src/repository/posts.repository';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, User]), EmailModule],
  controllers: [PostsController],
  providers: [PostsService, UsersService],
})
export class PostsModule {}
