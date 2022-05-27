import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ name: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ name: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
