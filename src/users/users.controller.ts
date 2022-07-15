import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './dto/credentialDto';
import { VerifyEmailDto } from './dto/verifyEmailDto';
import { UserLoginDto } from './dto/userLoginDto';
import { User } from './types/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAllUsers(): User[] {
    const userList = this.userService.findAllUsers();
    return userList;
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: UserDto): Promise<string> {
    const user = await this.userService.createUser(createUserDto);
    return `Create ${user.username}'s Identity Successfully!`;
  }

  @Post()
  verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    console.log(verifyEmailDto);
  }

  @Post()
  userLogin(@Body() userLoginDto: UserLoginDto) {
    console.log(userLoginDto);
  }

  @Get('/:id')
  getUserInfo(@Param('id') userId: string) {
    console.log(userId);
    // const user = this.userService.findUser(id);
    // return `UserName : ${user.username}`;
  }
}
