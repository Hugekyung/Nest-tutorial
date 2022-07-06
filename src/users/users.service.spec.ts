import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from './dto/credentialDto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('createUser TEST', () => {
    it('createUser : 유저 이름과 비밀번호를 받아 유저를 생성한다(리스트에 푸시한다).', () => {
      const createUserDto: UserDto = {
        username: 'test-user',
        password: 'test-password',
      };
      service.createUser(createUserDto);
      expect(service.findAllUsers().length).toBe(1);
      expect(service.findAllUsers()).toEqual([
        {
          username: 'test-user',
          password: 'test-password',
        },
      ]);
    });

    it('createUser : 이미 등록되어 있는 username이 존재한다면 에러를 반환한다.', () => {
      service.createUser({ username: 'test-user', password: 'test-password' });
      const newCreateUserDto = { username: 'test-user', password: 'test-password' };
      try {
        service.createUser(newCreateUserDto);
      } catch (error) {
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
        expect(error.message).toEqual('이미 동일한 유저이름이 존재합니다.');
      }
    });
  });

  describe('findUser TEST', () => {
    it('findUser : username 파라미터를 받아 해당하는 유저가 있으면 해당 유저정보를 반환한다.', () => {
      service.createUser({ username: 'test-user', password: 'test-password' });
      const id = 'test-user';
      const user = service.findUser(id);
      expect(user.username).toEqual('test-user');
    });

    it('findUser : username과 일치하는 유저가 없으면 에러를 반환한다.', () => {
      service.createUser({ username: 'test-user', password: 'test-password' });
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
      service.createUser({ username: 'test-user', password: 'test-password' });
      service.createUser({ username: 'test-user1', password: 'test-password1' });
      const deleteWantedUser = { username: 'test-user', password: 'test-password' };
      service.deleteUser(deleteWantedUser);
      expect(service.findAllUsers().length).toBe(1);
      expect(service.findAllUsers()).toEqual([
        { username: 'test-user1', password: 'test-password1' },
      ]);
    });

    it('deleteUser : 일치하는 유저 정보가 없다면, 에러를 반환한다.', () => {
      service.createUser({ username: 'test-user', password: 'test-password' });
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
