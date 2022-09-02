import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostRepository } from '../repository/posts.repository';
import { Connection, QueryRunner } from 'typeorm';
import { CreatePostDto } from './dto/createPostDto';
import { Post } from './post.entity';
import { PostsService } from './posts.service';
import { UserRepository } from '../repository/users.repository';

describe('PostsService', () => {
  let service: PostsService;
  let postDB: Post[];
  const postData: CreatePostDto = {
    title: 'test-post',
    description: 'test-description',
    userId: 1,
  };

  const queryRunner = {
    manager: {},
  } as QueryRunner;

  class MockConnection {
    // 2
    createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
      return queryRunner;
    }
  }

  class MockPostRepository {
    postDB = [postData];
    findAll = () => postDB;
  }

  class MockUserRepository {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(PostRepository), useClass: MockPostRepository },
        { provide: getRepositoryToken(UserRepository), useClass: MockUserRepository },
        {
          provide: Connection, // 이 부분 맞는지 확인 필요
          useClass: MockConnection,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    // service.createPost(createPostDto);
  });

  describe('getAllPosts TEST', () => {
    it('getAllPosts 함수를 호출하면 전체 Post를 조회한다.', async () => {
      const res = await service.getAllPosts();
      expect(res).toEqual([]);
    });
  });
});
