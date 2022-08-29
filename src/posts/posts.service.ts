import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '@repo/posts.repository';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { saveDataWithQueryRunner } from 'src/utils/db/transaction';
import { Connection } from 'typeorm';
import { CreatePostDto } from './dto/createPostDto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    private connection: Connection,
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

  private async savePostFormat(createPostDto: CreatePostDto, user: User) {
    const post = new Post();
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.createdAt = new Date();
    post.user = user;
    return post;
  }
}
