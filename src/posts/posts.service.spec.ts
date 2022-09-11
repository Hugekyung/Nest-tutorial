import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostRepository } from '../repository/posts.repository';
import { Connection, QueryRunner } from 'typeorm';
import { CreatePostDto } from './dto/createPostDto';
import { Post } from './post.entity';
import { PostsService } from './posts.service';
import { UserRepository } from '../repository/users.repository';
import { saveDataWithQueryRunner } from '../utils/db/transaction';
import { UsersService } from '../users/users.service';

describe('PostsService', () => {
  let service: PostsService;
  let userService: UsersService;
  let connection: Connection;

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
    postDB = [
      {
        id: 1,
        title: 'test-post',
        description: 'test-description',
        userId: 1,
      },
    ];
    findAll = jest.fn(() => this.postDB);
    findById = jest.fn((postId: number) => {
      return this.postDB.filter((post) => post.id === postId);
    });
  }

  class MockUserRepository {
    userDB = [
      {
        id: 1,
        username: 'test-user',
        email: 'test-user@example.com',
        password: 'test-password',
        nickname: 'test-nickname',
        gender: 'male',
      },
    ];
    findUserById = jest.fn((userId) => {
      return this.userDB.filter((user) => user.id === userId);
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersService, UserRepository],
      providers: [
        PostsService,
        UsersService,
        { provide: getRepositoryToken(PostRepository), useClass: MockPostRepository },
        { provide: getRepositoryToken(UserRepository), useClass: MockUserRepository },
        {
          provide: Connection, // 이 부분 맞는지 확인 필요
          useClass: MockConnection,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    userService = module.get<UsersService>(UsersService);
    connection = module.get<Connection>(Connection);
    // service.createPost(createPostDto);
  });

  describe('getAllPosts TEST', () => {
    it('getAllPosts 함수를 호출하면 전체 Post를 조회한다.', async () => {
      const res = await service.getAllPosts();
      expect(res).toEqual([
        {
          id: 1,
          title: 'test-post',
          description: 'test-description',
          userId: 1,
        },
      ]);
    });
  });

  describe('getPost TEST', () => {
    it('postId와 함께 getPost 함수를 호출하면 해당 post를 조회한다.', async () => {
      const postId = 1;
      const res = await service.getPost(postId);
      expect(res).toEqual([
        {
          id: 1,
          title: 'test-post',
          description: 'test-description',
          userId: 1,
        },
      ]);
    });

    it('DB에 존재하지 않는 postId를 담아 호출하면 빈 배열을 반환한다.', async () => {
      const postId = 2;
      const res = await service.getPost(postId);
      expect(res).toEqual([]);
    });
  });

  // describe('createPost TEST', () => {
  //   it('createPostDto를 인자로 담아 함수를 호출하면 successMessage를 반환한다.', async () => {
  //     const createPostDto = {
  //       title: 'test title',
  //       description: 'test',
  //       userId: 1,
  //     };
  // const queryRunner = connection.createQueryRunner();
  // jest.spyOn(queryRunner.manager, 'save');
  //     const res = await service.createPost(createPostDto);
  //     expect(res.successMessage).toEqual('Create Items Successfully!');
  //   });
  // });

  describe('savePostFormat TEST', () => {
    it('createPostDto 데이터를 담아 요청하면 post 객체를 반환한다.', async () => {
      const createPostDto: CreatePostDto = {
        title: 'test-post',
        description: 'test',
        userId: 1,
      };
      // userService.findUserById = jest.fn().mockResolvedValue(() => {});
      const userId = 1;
      const user = await userService.findUserById(userId);
      console.log(user);
      // const res = await service.savePostFormat(createPostDto, user);
      // console.log(res);
      // expect(res).toEqual({});
    });
  });
});
