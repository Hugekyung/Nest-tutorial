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
      expect(error.message).toBe('이미 존재하는 유저이름입니다.');
    }
  });

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
});
