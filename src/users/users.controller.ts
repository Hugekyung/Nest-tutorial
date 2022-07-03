import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dto/credentialDto';

@Controller('users')
export class UsersController {
  @Get()
  usersList(@Req() req: Request): string {
    console.log(req.body);
    return 'User Page!';
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): string {
    console.log(createUserDto);
    return `Created user Successfully! Username : ${createUserDto.username}`;
  }

  @Get(':id')
  findUser(@Param('id') id: string): string {
    return `user id parameter: ${id}`;
  }
}
