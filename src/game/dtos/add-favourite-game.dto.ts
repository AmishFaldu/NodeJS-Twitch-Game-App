import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddFavouriteGameDTO {
  @ApiProperty({ name: 'name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
