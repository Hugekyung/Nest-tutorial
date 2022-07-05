import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserDto } from './dto/credentialDto';
import { UserListPaging } from './dto/userListPaging';

@Controller('users')
export class UsersController {
  @Get()
  usersList(@Req() req: Request, @Query() query: UserListPaging): string {
    console.log(req.body);
    return `User Page! page : ${query.page}, limit : ${query.limit}`;
  }

  @Post()
  createUser(@Body() createUserDto: UserDto): string {
    console.log(createUserDto);
    return `Created user Successfully! Username : ${createUserDto.username}`;
  }

  @Get(':id')
  findUser(@Param('id') id: string): string {
    return `user id parameter: ${id}`;
  }
}
