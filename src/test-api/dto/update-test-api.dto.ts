import { PartialType } from '@nestjs/mapped-types';
import { CreateTestApiDto } from './create-test-api.dto';

export class UpdateTestApiDto extends PartialType(CreateTestApiDto) {}
