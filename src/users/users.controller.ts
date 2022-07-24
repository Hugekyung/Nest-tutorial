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
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAllUsers() {
    const users = this.userService.findAllUsers();
    return users;
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

  @Get('/:username')
  async getUserInfo(@Param('username') username: string) {
    return await this.userService.getUserInfo(username);
  }
}
