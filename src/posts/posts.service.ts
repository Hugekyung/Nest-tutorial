import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from 'src/repository/posts.repository';
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
  ) {}

  async getAllPosts() {
    return await this.postRepository.findAll();
  }

  async createPost(createPostDto: CreatePostDto) {
    const newPost = {
      title: createPostDto.title,
      description: createPostDto.description,
      createdAt: Date.now(),
      user: createPostDto.userId,
    };
    const post = this.savePostFormat(newPost);
    const resultMessage = await saveDataWithQueryRunner(this.connection, post);
    return resultMessage;
  }

  private async savePostFormat(newPost) {
    const post = new Post();
    post.title = newPost.title;
    post.description = newPost.description;
    post.createdAt = newPost.createdAt;
    post.user = newPost.user;
  }
}
