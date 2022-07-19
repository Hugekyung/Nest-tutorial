import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Gender } from '../types/constants';

export type Gender = typeof Gender[keyof typeof Gender];

export class UserDto {
  @Transform(({ value, obj }) => {
    if (obj.password.includes(value.trim())) {
      throw new BadRequestException('password는 username과 같은 문자열을 포함할 수 없습니다.');
    }
    return value.trim();
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly nickname?: string;

  @IsOptional()
  @IsString()
  readonly gender?: Gender;
}
