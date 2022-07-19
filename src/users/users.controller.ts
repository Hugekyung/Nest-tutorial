import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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

  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    const { signupVerifyToken } = verifyEmailDto;
    return await this.userService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async userLogin(@Body() userLoginDto: UserLoginDto) {
    return await this.userService.LoginUser(userLoginDto);
  }

  @Get('/:id')
  async getUserInfo(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getUserInfo(userId);
  }
}
