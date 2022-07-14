import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender } from '../types/constants';

export type Gender = typeof Gender[keyof typeof Gender];

export class UserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly nickname?: string;

  @IsOptional()
  @IsString()
  readonly gender?: Gender;
}
