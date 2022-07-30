import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { UserDto } from './dto/credentialDto';
import { UserInfo } from './types/user.interface';
import { EmailService } from '../email/email.service';
import { UserLoginDto } from './dto/userLoginDto';
import { UserEntity } from './user.entity';
import { ICreateUserMessage } from 'src/utils/types/error.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private emailService: EmailService,
    private connection: Connection,
  ) {}

  async findAllUsers() {
    return await this.usersRepository.find();
  }

  async findUser(username: string) {
    const user = await this.usersRepository.findOne({ username });
    if (!user) {
      throw new HttpException('일치하는 유저가 없습니다.', HttpStatus.FORBIDDEN);
    }
    return user;
  }

  async getUserInfo(username: string) {
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답 Promise<UserInfo>
    const foundUser = await this.usersRepository.findOne({ username });
    if (!foundUser) {
      throw new HttpException(
        'username에 해당하는 유저가 존재하지 않습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    return foundUser;
  }

  async LoginUser(userLoginDto: UserLoginDto) {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. JWT를 발급
  }

  async createUser(createUserDto: UserDto) {
    const checkedUserExist = await this.checkUserExists(createUserDto.email);
    console.log('checkedUserExist >>', checkedUserExist);
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

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let result: ICreateUserMessage = {
      successMessage: `Create ${newUser.username}'s Identity Successfully!`,
    };
    try {
      const user = await this.saveUserFormat(newUser, signupVerifyToken);
      await queryRunner.manager.save(user);
      await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);
      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
      result = { errorMessage: e.message };
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
      if (result.errorMessage) {
        return result;
      }
    }

    return result;
  }

  async checkUserExists(email: string) {
    console.log(email);
    const user = await this.usersRepository.findOne({ email });
    return user !== undefined;
  }

  private async saveUserFormat(newUser: UserDto, signupVerifyToken: string) {
    const user = new UserEntity();
    user.username = newUser.username;
    user.email = newUser.email;
    user.password = newUser.password;
    user.nickname = newUser.nickname;
    user.gender = newUser.gender;
    user.signupVerifyToken = signupVerifyToken;
    return user;
  }

  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string) {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
  }

  async updateUser(username: string, password: string, fieldToUpdate: Partial<UserInfo>) {
    const foundUser = await this.getUserInfo(username);
    const correctPassword = foundUser.password === password ? true : false;
    if (!correctPassword) {
      throw new HttpException('패스워드가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    foundUser.password = fieldToUpdate.updatePassword ?? foundUser.password;
    foundUser.nickname = fieldToUpdate.nickname ?? foundUser.nickname;
    foundUser.gender = fieldToUpdate.gender ?? foundUser.gender;

    // 수정된 정보 db 업데이트
  }

  async deleteUser(deleteWantedUser: UserDto) {
    const foundUser = await this.getUserInfo(deleteWantedUser.username);
    const correctPassword = foundUser.password === deleteWantedUser.password ? true : false;
    if (!correctPassword) {
      throw new HttpException('패스워드가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    await this.usersRepository.remove(foundUser);
  }
}
