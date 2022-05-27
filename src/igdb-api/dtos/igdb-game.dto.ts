import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class BaseClass {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class AlternativeName extends BaseClass {
  @ApiProperty()
  @IsString()
  name: string;
}

export class Collection extends BaseClass {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class Cover extends BaseClass {
  @ApiProperty()
  @IsString()
  url: string;
}

export class Franchise extends BaseClass {
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class GameEngine extends BaseClass {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class GameMode extends BaseClass {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class Genere extends BaseClass {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class Platform extends BaseClass {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class ReleaseDate extends BaseClass {
  @ApiProperty()
  @IsString()
  human: string;
}

export class Screenshot extends BaseClass {
  @ApiProperty()
  @IsString()
  url: string;
}

export class Website extends BaseClass {
  @ApiProperty()
  @IsString()
  url: string;
}

export class Video extends BaseClass {
  @ApiProperty()
  @IsString()
  video_id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class IGDBGameDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ type: AlternativeName, isArray: true })
  @IsArray()
  alternative_names: [{ id: string; name: string }];

  @ApiProperty()
  @IsNumber()
  category: number;

  @ApiProperty({ type: Collection })
  @IsObject()
  collection: Collection;

  @ApiProperty({ type: Cover })
  @IsObject()
  cover: Cover;

  @ApiProperty()
  @IsNumber()
  created_at: number;

  @ApiProperty()
  @IsNumber()
  first_release_date: number;

  @ApiProperty()
  @IsNumber()
  follows: number;

  @ApiProperty({ type: Franchise })
  @IsObject()
  franchise: Franchise;

  @ApiProperty({ type: GameEngine, isArray: true })
  @IsArray()
  game_engines: GameEngine[];

  @ApiProperty({ type: GameMode, isArray: true })
  @IsArray()
  game_modes: GameMode[];

  @ApiProperty({ type: Genere, isArray: true })
  @IsArray()
  generes: Genere[];

  @ApiProperty()
  @IsNumber()
  hypes: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ type: Platform, isArray: true })
  @IsArray()
  platforms: Platform[];

  @ApiProperty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsNumber()
  rating_count: number;

  @ApiProperty({ type: ReleaseDate, isArray: true })
  @IsArray()
  release_dates: ReleaseDate[];

  @ApiProperty({ type: Screenshot, isArray: true })
  @IsArray()
  screenshots: Screenshot[];

  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsArray()
  websites: [{ id: string; url: string }];

  @ApiProperty()
  @IsString()
  storyline: string;

  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsNumber()
  total_rating: number;

  @ApiProperty()
  @IsNumber()
  total_rating_count: number;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  version_title: string;

  @ApiProperty()
  @IsArray()
  videos: [{ id: string; video_id: string; name: string }];
}
