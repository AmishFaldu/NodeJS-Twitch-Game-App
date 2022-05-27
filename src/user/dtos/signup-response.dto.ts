import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SingupResponseDTO {
  @ApiProperty({ name: 'token' })
  @IsString()
  token: string;
}
