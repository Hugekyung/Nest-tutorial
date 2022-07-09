import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UserDto } from './dto/credentialDto';
import { User, UserInfo } from './types/user.interface';

@Injectable()
export class UsersService {
  private usersArr: User[] = [];

  findAllUsers() {
    return this.usersArr;
  }

  findUser(username: string) {
    const user = this.usersArr.find((user) => user.username === username);
    if (!user) {
      throw new HttpException('일치하는 유저가 없습니다.', HttpStatus.FORBIDDEN);
    }
    return user;
  }

  createUser(createUserDto: UserDto) {
    if (this.usersArr.find((user) => user.username === createUserDto.username)) {
      throw new HttpException('이미 동일한 유저이름이 존재합니다.', HttpStatus.FORBIDDEN);
    }

    const nickname = createUserDto.nickname ?? null;
    const gender = createUserDto.gender ?? null;
    if (!nickname) {
      createUserDto.nickname = 'unknown';
    }
    if (!gender) {
      createUserDto.gender = 'none';
    }
    this.usersArr.push(createUserDto);
  }

  updateUser(username: string, password: string, fieldToUpdate: Partial<UserInfo>) {
    const existedUser = this.usersArr.find((user) => user.username === username);
    if (!existedUser) {
      throw new HttpException(
        'username에 해당하는 유저가 존재하지 않습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    const correctPassword = this.usersArr.find(
      (user) => user.username === username && user.password === password,
    );
    if (!correctPassword) {
      throw new HttpException('패스워드가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    this.usersArr.forEach((user) => {
      if (user.username === username) {
        user.password = fieldToUpdate.updatePassword ?? user.password;
        user.nickname = fieldToUpdate.nickname ?? user.nickname;
        user.gender = fieldToUpdate.gender ?? user.gender;
      }
    });
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
      throw new HttpException('일치하는 유저 정보가 없습니다.', HttpStatus.FORBIDDEN);
    }
  }
}
