import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        //   { provide: getRepositoryToken(Post), useClass: MockUserRepository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });
});

describe('gertAllPosts TEST', () => {});
