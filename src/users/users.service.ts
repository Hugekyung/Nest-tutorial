import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { UserDto } from './dto/credentialDto';
import { User, UserInfo } from './types/user.interface';
import { EmailService } from '../email/email.service';
import { UserLoginDto } from './dto/userLoginDto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  private usersArr: User[] = [];

  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}

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

  async getUserInfo(userId: number): Promise<void> {
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답 Promise<UserInfo>
    return;
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

    await this.saveUser(newUser, signupVerifyToken);
    await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);
    // this.usersArr.push(newUser);

    return { username: newUser.username };
  }

  private async checkUserExists(email: string) {
    const user = await this.usersRepository.findOne({ email });
    return user !== undefined;
  }

  private async saveUser(newUser: UserDto, signupVerifyToken: string) {
    const user = new UserEntity();
    user.username = newUser.username;
    user.email = newUser.email;
    user.password = newUser.password;
    user.nickname = newUser.nickname;
    user.gender = newUser.gender;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
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
