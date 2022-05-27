import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetSpecificGameDTO } from './dtos/get-specific-game.dto';
import { IGDBGameDTO } from './dtos/igdb-game.dto';
import { IgdbApiService } from './igdb-api.service';

@Controller('igdb-api')
@ApiTags('IGDB Games Routes')
export class IgdbApiController {
  constructor(private igdbApiService: IgdbApiService) {}

  @Get('/get-all-games')
  @ApiResponse({ type: IGDBGameDTO, isArray: true })
  getAllGamesPaginated(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IGDBGameDTO[]> {
    return this.igdbApiService.getAllGamesPaginated({ skip, limit });
  }

  @Post('/get-specific-game')
  @ApiBody({ type: GetSpecificGameDTO })
  @ApiResponse({ type: IGDBGameDTO, isArray: true })
  getSpecificGame(
    @Body() payload: GetSpecificGameDTO,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IGDBGameDTO[]> {
    return this.igdbApiService.getSpecificGame({ payload, skip, limit });
  }
}
