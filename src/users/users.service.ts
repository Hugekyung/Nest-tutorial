import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/credentialDto';
import { User } from './types/user.interface';

@Injectable()
export class UsersService {
  private readonly usersArr: User[] = [];

  createUser(createUserDto: CreateUserDto) {
    if (this.usersArr.find((user) => user.username === createUserDto.username)) {
      throw new Error('이미 존재하는 유저이름입니다.');
    }
    this.usersArr.push(createUserDto);
  }

  findAllUsers() {
    return this.usersArr;
  }
}
