import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from './dto/credentialDto';
import { User } from './types/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  findAllUsers(): User[] {
    const userList = this.userService.findAllUsers();
    return userList;
  }

  @Post()
  createUser(@Body() createUserDto: UserDto): string {
    this.userService.createUser(createUserDto);
    return `Create New User! : ${createUserDto.username}`;
  }

  @Get(':id')
  findUser(@Param('id') id: string): string {
    const user = this.userService.findUser(id);
    return user.username;
  }
}
