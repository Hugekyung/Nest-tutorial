import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/createPostDto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPostsList() {
    const posts = this.postsService.getAllPosts();
    return posts;
  }

  @Get(':id')
  getPost(@Param('id') postId: number) {
    const post = this.postsService.getPost(postId);
    return post;
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    const post = this.postsService.createPost(createPostDto);
    return post;
  }
}
