import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from './dto/credentialDto';
import { UserInfo } from './types/user.interface';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    const createUserDto: UserDto = {
      username: 'test-user',
      password: 'test-password',
      nickname: 'test-nickname',
      gender: 'male',
    };
    service = module.get<UsersService>(UsersService);
    service.createUser(createUserDto);
  });

  describe('createUser TEST', () => {
    it('createUser : 유저 이름과 비밀번호를 받아 유저를 생성한다(리스트에 푸시한다).', () => {
      expect(service.findAllUsers().length).toBe(1);
      expect(service.findAllUsers()).toEqual([
        {
          username: 'test-user',
          password: 'test-password',
          nickname: 'test-nickname',
          gender: 'male',
        },
      ]);
    });

    it('createUser : 이미 등록되어 있는 username이 존재한다면 에러를 반환한다.', () => {
      const newCreateUserDto = { username: 'test-user', password: 'test-password' };
      try {
        service.createUser(newCreateUserDto);
      } catch (error) {
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual('이미 동일한 유저이름이 존재합니다.');
      }
    });

    it('createUser : nickname과 gender 값이 RequestBody에 없다면 지정된 값으로 할당하여 유저를 생성한다.', () => {
      service.createUser({ username: 'test-user-2', password: 'test-password' });
      const username = 'test-user-2';
      const user = service.findUser(username);
      expect(user.nickname).toEqual('unknown');
      expect(user.gender).toEqual('none');
    });
  });

  describe('updateUser TEST', () => {
    it('username, nickname과 gender 값을 인자로 받아 해당 유저 정보를 업데이트 한다', () => {
      const username = 'test-user';
      const fieldToUpdate: UserInfo = { nickname: 'new-nickname', gender: 'female' };
      service.updateUser(username, fieldToUpdate);
      expect(service.findUser(username).nickname).toEqual('new-nickname');
      expect(service.findUser(username).gender).toEqual('female');
    });

    it('nickname과 gender 값 중 없는 값이 있다면 원래 설정되어 있는 기본 값을 유지한다.', () => {
      const username = 'test-user';
      const fieldToUpdate: UserInfo = { nickname: 'new-nickname' };
      service.updateUser(username, fieldToUpdate);
      expect(service.findUser(username).nickname).toEqual('new-nickname');
      expect(service.findUser(username).gender).toEqual('male');
    });

    it('수정하고자 하는 username이 db(user배열)에 존재하지 않는다면 에러를 반환한다.', () => {
      const username = 'test-user-1';
      const fieldToUpdate: UserInfo = { nickname: 'new-nickname' };
      try {
        service.updateUser(username, fieldToUpdate);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual('username에 해당하는 유저가 존재하지 않습니다.');
      }
    });
  });

  describe('findUser TEST', () => {
    it('findUser : username 파라미터를 받아 해당하는 유저가 있으면 해당 유저정보를 반환한다.', () => {
      const id = 'test-user';
      const user = service.findUser(id);
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
    it('deleteUser : 유저 아이디와 비밀번호를 받아, 정보가 일치하는 유저가 있다면 삭제한다(리스트에서 삭제한다).', () => {
      service.createUser({ username: 'test-user1', password: 'test-password1' });
      const deleteWantedUser = { username: 'test-user', password: 'test-password' };
      service.deleteUser(deleteWantedUser);
      expect(service.findAllUsers().length).toBe(1);
      expect(service.findAllUsers()).toEqual([
        { username: 'test-user1', password: 'test-password1', nickname: 'unknown', gender: 'none' },
      ]);
    });

    it('deleteUser : 일치하는 유저 정보가 없다면, 에러를 반환한다.', () => {
      const deleteWantedUser = { username: 'test-user-1', password: 'test-password' };
      try {
        service.deleteUser(deleteWantedUser);
      } catch (error) {
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual('일치하는 유저 정보가 없습니다.');
      }
    });
  });
});
