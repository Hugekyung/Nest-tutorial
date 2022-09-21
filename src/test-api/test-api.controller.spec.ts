import { Test, TestingModule } from '@nestjs/testing';
import { TestApiController } from './test-api.controller';
import { TestApiService } from './test-api.service';

describe('TestApiController', () => {
  let controller: TestApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestApiController],
      providers: [TestApiService],
    }).compile();

    controller = module.get<TestApiController>(TestApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
