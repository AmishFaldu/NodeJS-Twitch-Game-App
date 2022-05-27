import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetSpecificGameDTO {
  // Name of the game
  @ApiProperty({ title: 'name' })
  @IsString()
  @IsOptional()
  name?: string;

  // Followers of the game
  @ApiProperty({ title: 'followers', type: 'integer' })
  @IsNumber()
  @IsOptional()
  followers?: number;

  // Average rating of the game by igdb users
  @ApiProperty({
    title: 'rating',
    type: 'number',
    format: 'float',
  })
  @IsNumber()
  @IsOptional()
  rating?: number;

  // Average rating of the game by igdb users and other critics
  @ApiProperty({ title: 'totalRating', type: 'number', format: 'float' })
  @IsNumber()
  @IsOptional()
  totalRating?: number;
}
