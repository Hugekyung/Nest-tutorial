import { Module } from '@nestjs/common';
import { TestApiService } from './test-api.service';
import { TestApiController } from './test-api.controller';

@Module({
  controllers: [TestApiController],
  providers: [TestApiService]
})
export class TestApiModule {}
