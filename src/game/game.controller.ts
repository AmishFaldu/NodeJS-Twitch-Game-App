import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { IGDBGameDTO } from '../igdb-api/dtos/igdb-game.dto';
import { AddFavouriteGameDTO } from './dtos/add-favourite-game.dto';
import { GameDTO } from './dtos/game.dto';
import { GameService } from './game.service';

@Controller('game')
@ApiTags('Game')
export class GameController {
  constructor(private gameService: GameService) {}

  @ApiResponse({ type: IGDBGameDTO })
  @ApiBody({ type: AddFavouriteGameDTO })
  @Post('add-favourite-game')
  addFavouriteGame(
    @Req() request: Request & { user: { id: string; email: string } },
    @Body() payload: AddFavouriteGameDTO,
  ): Promise<IGDBGameDTO> {
    const userId = request.user.id;
    return this.gameService.addFavouriteGame({ payload, userId });
  }

  @ApiResponse({ type: GameDTO, isArray: true })
  @Get()
  listAllFavouriteGames(
    @Req() request: Request & { user: { id: string; email: string } },
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<GameDTO[]> {
    const userId = request.user.id;
    return this.gameService.listAllFavouriteGames({ userId, skip, limit });
  }
}
