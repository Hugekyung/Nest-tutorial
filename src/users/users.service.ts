import { Injectable } from '@nestjs/common';
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
      throw new Error('일치하는 유저가 없습니다.');
    }
    return user;
  }

  createUser(createUserDto: UserDto) {
    if (this.usersArr.find((user) => user.username === createUserDto.username)) {
      throw new Error('이미 존재하는 유저이름입니다.');
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
    }
    this.usersArr = newUserArr;
  }
}
