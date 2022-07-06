import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UserDto } from './dto/credentialDto';
import { User } from './types/user.interface';

@Injectable()
export class UsersService {
  private usersArr: User[] = [];

  findAllUsers() {
    return this.usersArr;
  }

  findUser(username: string) {
    const user = this.usersArr.find((user) => user.username === username);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: '일치하는 유저가 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }

  createUser(createUserDto: UserDto) {
    if (this.usersArr.find((user) => user.username === createUserDto.username)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: '이미 동일한 유저이름이 존재합니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    this.usersArr.push(createUserDto);
  }

  deleteUser(deleteWantedUser: UserDto) {
    const matchedUser = this.usersArr.find(
      (user) =>
        user.username === deleteWantedUser.username && user.password === deleteWantedUser.password,
    );

    let newUserArr: User[];
    if (matchedUser) {
      newUserArr = this.usersArr.filter((user) => user.username !== deleteWantedUser.username);
      this.usersArr = newUserArr;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: '일치하는 유저 정보가 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
