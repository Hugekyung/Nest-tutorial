import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender } from '../types/constants';

type Gender = typeof Gender[keyof typeof Gender];

export class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  gender: Gender;
}
