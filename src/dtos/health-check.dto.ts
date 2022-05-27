import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HealthCheckDTO {
  @ApiProperty()
  @IsString()
  message: string;
}
