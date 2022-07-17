import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { UserDto } from './dto/credentialDto';
import { User, UserInfo } from './types/user.interface';
import { EmailService } from '../email/email.service';
import { UserLoginDto } from './dto/userLoginDto';

@Injectable()
export class UsersService {
  private usersArr: User[] = [];

  constructor(private emailService: EmailService) {}

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

  async LoginUser(userLoginDto: UserLoginDto) {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. JWT를 발급
  }

  async createUser(createUserDto: UserDto) {
    if (this.usersArr.find((user) => user.username === createUserDto.username)) {
      throw new HttpException('이미 동일한 유저이름이 존재합니다.', HttpStatus.FORBIDDEN);
    }

    const checkedUserExist = await this.checkUserExists(createUserDto.email);
    if (checkedUserExist) {
      throw new HttpException('해당 email이 이미 존재합니다.', HttpStatus.FORBIDDEN);
    }
    const signupVerifyToken = uuidV4();

    const newUser = { ...createUserDto };
    const nickname = newUser.nickname ?? null;
    const gender = newUser.gender ?? null;
    if (!nickname) {
      newUser.nickname = 'unknown';
    }
    if (!gender) {
      newUser.gender = 'none';
    }

    // TODO : DB 연동 후 적용 예정
    // await this.saveUser(createUserDto, signupVerifyToken);
    await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);
    this.usersArr.push(newUser);

    return { username: newUser.username };
  }

  private checkUserExists(email: string) {
    if (this.usersArr.find((user) => user.email === email)) return true;
    return false;
    // TODO : DB 연동 예정
  }

  private saveUser(createUserDto: UserDto, signupVerifyToken: string) {
    return; // TODO : DB 연동 후 구현 예정
  }

  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string) {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
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
