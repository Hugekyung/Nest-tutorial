import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { UserDto } from './dto/credentialDto';
import { UserListPaging } from './dto/userListPaging';
import { User } from './types/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  usersList(@Req() req: Request, @Query() query: UserListPaging): string {
    console.log(req.body);
    return `User Page! page : ${query.page}, limit : ${query.limit}`;
  }

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
    return `user id parameter: ${id}`;
  }
}
