import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from 'src/repository/posts.repository';
import { CreatePostDto } from './dto/createPostDto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
  ) {}

  getAllPosts() {
    return this.postRepository.findAll();
  }

  createPost(createPostDto: CreatePostDto) {}
}
