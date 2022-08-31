import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostDto } from './dto/createPostDto';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  let postDB: Post[];

  //   class MockPostRepository {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        //   { provide: getRepositoryToken(Post), useClass: MockPostRepository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postDB = [];
    // service.createPost(createPostDto);
  });

  describe('gertAllPosts TEST', () => {
    const postData: CreatePostDto = {
      title: 'test-post',
      description: 'test-description',
      userId: 1,
    };
    console.log(postDB);
    expect(postDB).toEqual([]);
    // service.createPost = jest.fn((postData) => postDB.push(postData)).mockResolvedValue()
  });
});
