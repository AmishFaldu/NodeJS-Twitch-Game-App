import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public-metadata.decorator';
import { CreateUserDTO } from './dtos/create-user.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { LoginUserDTO } from './dtos/login-user.dto';
import { SingupResponseDTO } from './dtos/signup-response.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@Public()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  @ApiResponse({ type: SingupResponseDTO })
  signupNewUser(@Body() payload: CreateUserDTO): Promise<SingupResponseDTO> {
    return this.userService.createUser(payload);
  }

  @Post('login')
  @ApiResponse({ type: SingupResponseDTO })
  loginUser(@Body() payload: LoginUserDTO): Promise<LoginResponseDTO> {
    return this.userService.login(payload);
  }
}
