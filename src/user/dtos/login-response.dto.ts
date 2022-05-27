import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginResponseDTO {
  @ApiProperty({ name: 'token' })
  @IsString()
  token: string;
}
