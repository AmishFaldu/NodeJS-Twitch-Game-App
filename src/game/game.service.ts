import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGDBGameDTO } from '../igdb-api/dtos/igdb-game.dto';
import { IgdbApiService } from '../igdb-api/igdb-api.service';
import { UserService } from '../user/user.service';
import { AddFavouriteGameDTO } from './dtos/add-favourite-game.dto';
import { GameDTO } from './dtos/game.dto';
import { GameEntity } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity) private gameRepo: Repository<GameEntity>,
    private igdbApiService: IgdbApiService,
    private userService: UserService,
  ) {}

  /**
   * This method will add favourite game from IGDB to backend DB
   * @param payload AddFavouriteGameDTO
   * @returns Game from IGDB added to backend DB
   */
  async addFavouriteGame({
    payload,
    userId,
  }: {
    payload: AddFavouriteGameDTO;
    userId: string;
  }): Promise<IGDBGameDTO> {
    const user = await this.userService.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException({
        message: 'Unauthorized to perform this operation',
      });
    }

    const game = await this.igdbApiService.getSpecificGame({
      payload,
      skip: 0,
      limit: 1,
    });

    if (!game?.length) {
      throw new BadRequestException({
        message: 'Game with that name not found!',
      });
    }

    try {
      const gameEntity = this.gameRepo.create({
        igdbGameId: game[0].id,
        name: payload.name,
        user,
      });
      await this.gameRepo.save(gameEntity);
      return game[0];
    } catch (error) {
      // This error code means the error is from typeorm
      // It also means that the game we are trying to add in already in database
      if (error?.code === '23505') {
        throw new BadRequestException({
          message: 'Game already in favourites',
        });
      }

      Logger.error(
        `game.service : addFavouriteGame : Something gone wrong while adding game : ${error}`,
      );
    }
    throw new InternalServerErrorException({
      message: 'Something gone wrong while adding game to favourites',
    });
  }

  /**
   * This method will fetch all the list of favourite games paginated
   * @param skip Number of games to skip
   * @param limit Number of games to fetch at a time
   * @returns Favourite games from backend DB
   */
  async listAllFavouriteGames({
    userId,
    skip,
    limit,
  }: {
    userId: string;
    skip: number;
    limit: number;
  }): Promise<GameDTO[]> {
    return this.gameRepo.find({ where: { user: userId }, take: limit, skip });
  }
}
