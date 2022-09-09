import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PostRepository } from '../repository/posts.repository';
import { UsersService } from '../users/users.service';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/createPostDto';
import { saveDataWithQueryRunner } from '../utils/db/transaction';
import { UserRepository } from '../repository/users.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    private connection: Connection,
    @InjectRepository(UserRepository)
    private usersService: UsersService,
  ) {}

  async getAllPosts() {
    return await this.postRepository.findAll();
  }

  async getPost(postId: number) {
    return await this.postRepository.findById(postId);
  }

  async createPost(createPostDto: CreatePostDto) {
    const user = await this.usersService.findUserById(createPostDto.userId);
    if (!user) {
      throw new HttpException('일치하는 유저가 없습니다.', HttpStatus.FORBIDDEN);
    }

    const post = await this.savePostFormat(createPostDto, user);
    const resultMessage = await saveDataWithQueryRunner(this.connection, post);
    return resultMessage;
  }

  async savePostFormat(createPostDto: CreatePostDto, user: User) {
    const post = new Post();
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.createdAt = new Date();
    post.user = user;
    return post;
  }
}
