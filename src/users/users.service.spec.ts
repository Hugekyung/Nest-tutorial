import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { EmailService } from '../email/email.service';
import { UserDto } from './dto/credentialDto';
import { UserInfo } from './types/user.interface';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  class MockConnection {}
  class MockUserRepository {
    #data = [];
    find() {}
    findOne() {}
    remove() {}
    // Entity랑 Entity를 통해 DB에 접근하는 메소드들 Mocking필요
    // Entity 메소드같은 경우에는 실제 데이터베이스 접근 대신 배열로 처리
  }
  // 트랜잭션을 위해 사용한 Connection도 Mocking 처리 필요

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        EmailService,
        { provide: getRepositoryToken(UserEntity), useClass: MockUserRepository },
        {
          provide: Connection, // 이 부분 맞는지 확인 필요
          useClass: MockConnection,
        },
      ],
    }).compile();

    const createUserDto: UserDto = {
      username: 'test-user',
      email: 'test-user@example.com',
      password: 'test-password',
      nickname: 'test-nickname',
      gender: 'male',
    };

    service = module.get<UsersService>(UsersService);
    service.sendMemberJoinEmail = jest.fn();
    service.createUser(createUserDto);
  });

  describe('createUser TEST', () => {
    it('createUser : 유저 이름과 비밀번호를 받아 유저를 생성한다(리스트에 푸시한다).', async () => {
      const res = await service.findAllUsers();
      expect(res.length).toBe(1);
      expect(service.findAllUsers()).toEqual([
        {
          username: 'test-user',
          email: 'test-user@example.com',
          password: 'test-password',
          nickname: 'test-nickname',
          gender: 'male',
        },
      ]);
    });

    it('createUser : nickname과 gender 값이 RequestBody에 없다면 지정된 값으로 할당하여 유저를 생성한다.', async () => {
      await service.createUser({
        username: 'test-user-2',
        email: 'test-user2@example.com',
        password: 'test-password',
      });
      const username = 'test-user-2';
      const user = await service.findUser(username);
      expect(user.nickname).toEqual('unknown');
      expect(user.gender).toEqual('none');
    });

    it('createUser : email값이 중복될 경우 에러를 반환한다.', async () => {
      try {
        await service.createUser({
          username: 'test-user-2',
          email: 'test-user@example.com',
          password: 'test-password',
        });
      } catch (error) {
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual('해당 email이 이미 존재합니다.');
      }
    });
  });

  describe('checkUserExists TEST', () => {
    it('checkUserExists : 이미 등록된 이메일인 경우 true를 반환합니다.', () => {});
  });

  describe('updateUser TEST', () => {
    it('username, nickname과 gender 값을 인자로 받아 해당 유저 정보를 업데이트 한다', async () => {
      const username = 'test-user';
      const password = 'test-password';
      const fieldToUpdate: UserInfo = { nickname: 'new-nickname', gender: 'female' };
      service.updateUser(username, password, fieldToUpdate);
      const updatedUser = await service.findUser(username);
      expect(updatedUser.nickname).toEqual('new-nickname');
      expect(updatedUser.gender).toEqual('female');
    });

    it('nickname과 gender 값 중 없는 값이 있다면 원래 설정되어 있는 기본 값을 유지한다.', async () => {
      const username = 'test-user';
      const password = 'test-password';
      const fieldToUpdate: UserInfo = {
        nickname: 'new-nickname',
        updatePassword: 'update-password',
      };
      service.updateUser(username, password, fieldToUpdate);
      const updatedUser = await service.findUser(username);
      expect(updatedUser.nickname).toEqual('new-nickname');
      expect(updatedUser.gender).toEqual('male');
      expect(updatedUser.password).toEqual('update-password');
    });

    it('수정하고자 하는 username이 db(user배열)에 존재하지 않는다면 에러를 반환한다.', async () => {
      const username = 'test-user-1';
      const password = 'test-password';
      const fieldToUpdate: UserInfo = { nickname: 'new-nickname' };
      try {
        await service.updateUser(username, password, fieldToUpdate);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual('username에 해당하는 유저가 존재하지 않습니다.');
      }
    });

    it('수정하고자 하는 user의 password가 일치하지 않으면, 에러를 반환한다.', async () => {
      const username = 'test-user';
      const password = 'test-password-2';
      const fieldToUpdate: UserInfo = { nickname: 'new-nickname' };
      try {
        await service.updateUser(username, password, fieldToUpdate);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.message).toEqual('패스워드가 일치하지 않습니다.');
      }
    });
  });

  describe('findUser TEST', () => {
    it('findUser : username 파라미터를 받아 해당하는 유저가 있으면 해당 유저정보를 반환한다.', async () => {
      const id = 'test-user';
      const user = await service.findUser(id);
      expect(user.username).toEqual('test-user');
    });

    it('findUser : username과 일치하는 유저가 없으면 에러를 반환한다.', () => {
      const id = 'test-user-1';
      try {
        service.findUser(id);
      } catch (error) {
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual('일치하는 유저가 없습니다.');
      }
    });
  });

  describe('deleteUser TEST', () => {
    it('deleteUser : 유저 아이디와 비밀번호를 받아, 정보가 일치하는 유저가 있다면 삭제한다(리스트에서 삭제한다).', async () => {
      await service.createUser({
        username: 'test-user1',
        email: 'test-user2@example.com',
        password: 'test-password1',
      });
      const deleteWantedUser = {
        username: 'test-user',
        email: 'test-user@example.com',
        password: 'test-password',
      };
      service.deleteUser(deleteWantedUser);
      const users = await service.findAllUsers();
      expect(users.length).toBe(1);
      expect(users).toEqual([
        {
          username: 'test-user1',
          email: 'test-user2@example.com',
          password: 'test-password1',
          nickname: 'unknown',
          gender: 'none',
        },
      ]);
    });

    it('deleteUser : 일치하는 유저 정보가 없다면, 에러를 반환한다.', () => {
      const deleteWantedUser = {
        username: 'test-user-1',
        email: 'test-user2@example.com',
        password: 'test-password',
      };
      try {
        service.deleteUser(deleteWantedUser);
      } catch (error) {
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual('일치하는 유저 정보가 없습니다.');
      }
    });
  });
});
