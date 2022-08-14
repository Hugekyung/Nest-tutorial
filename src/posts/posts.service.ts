import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from 'src/repository/posts.repository';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { saveDataWithQueryRunner } from 'src/utils/db/transaction';
import { Connection } from 'typeorm';
import { CreatePostDto } from './dto/createPostDto';
import { Post } from './post.entity';

interface InewPost {
  title: string;
  description: string;
  createdAt: Date;
  user: User;
}

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

  async createPost(createPostDto: CreatePostDto) {
    const user = await this.usersService.findUserById;
    // const newPost = {
    //   title: createPostDto.title,
    //   description: createPostDto.description,
    //   createdAt: Date.now(),
    //   user: createPostDto.userId,
    // };
    const post = this.savePostFormat(createPostDto);
    const resultMessage = await saveDataWithQueryRunner(this.connection, post);
    return resultMessage;
  }

  private async savePostFormat(createPostDto: CreatePostDto) {
    const post = new Post();
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.createdAt = new Date();
    // post.user = createPostDto.userId;
  }
}
