import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  @Get()
  usersList(@Req() req: Request): string {
    console.log(req.body);
    return 'User Page!';
  }
}
