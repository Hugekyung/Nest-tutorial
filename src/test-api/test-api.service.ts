import { Injectable } from '@nestjs/common';
import { CreateTestApiDto } from './dto/create-test-api.dto';
import { UpdateTestApiDto } from './dto/update-test-api.dto';

@Injectable()
export class TestApiService {
  create(createTestApiDto: CreateTestApiDto) {
    return 'This action adds a new testApi';
  }

  findAll() {
    return `This action returns all testApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testApi`;
  }

  update(id: number, updateTestApiDto: UpdateTestApiDto) {
    return `This action updates a #${id} testApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} testApi`;
  }
}
