import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AddFavouriteGameDTO } from './dtos/add-favourite-game.dto';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;
  let mockedGameServiceDataStore = [];
  const mockedGameService = {
    addFavouriteGame: ({
      payload,
      userId,
    }: {
      payload: AddFavouriteGameDTO;
      userId: string;
    }) => {
      mockedGameServiceDataStore.push({ name: payload.name, userId });
      return payload;
    },
    listAllFavouriteGames: ({
      userId,
      skip,
      limit,
    }: {
      userId: string;
      skip: number;
      limit: number;
    }) => {
      const listData = mockedGameServiceDataStore
        .filter((item) => item.userId === userId)
        .slice(skip, skip + limit);
      return listData;
    },
  };

  beforeEach(async () => {
    // Clear all the data stored
    mockedGameServiceDataStore = [];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: mockedGameService }],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add favourite game', async () => {
    const response = await controller.addFavouriteGame(
      {
        user: { id: '123456', email: 'test@test.test' },
      } as Request & { user: { id: string; email: string } },
      { name: 'The fifth expedition' },
    );

    expect(response.name).toBe('The fifth expedition');
  });

  it('should list favourite games', async () => {
    // Add a new game
    await controller.addFavouriteGame(
      {
        user: { id: '123456', email: 'test@test.test' },
      } as Request & { user: { id: string; email: string } },
      {
        name: 'The fifth expedition',
      },
    );

    const response = await controller.listAllFavouriteGames(
      {
        user: { id: '123456', email: 'test@test.test' },
      } as Request & { user: { id: string; email: string } },
      0,
      10,
    );

    expect(response?.length).toBeLessThanOrEqual(10);
    expect(response[0].name).toBe('The fifth expedition');
  });
});
