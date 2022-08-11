import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  postsList() {
    const posts = this.postsService.getAllPosts();
    return { message: 'success!' };
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    const post = this.postsService.createPost(createPostDto);
    return post;
  }
}
