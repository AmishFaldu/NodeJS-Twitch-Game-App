import { Test, TestingModule } from '@nestjs/testing';
import { GetSpecificGameDTO } from './dtos/get-specific-game.dto';
import { IgdbApiController } from './igdb-api.controller';
import { IgdbApiService } from './igdb-api.service';

describe('IgdbApiController', () => {
  let controller: IgdbApiController;
  const mockedIgdbApiServiceDataStore = [
    { name: 'Game1', follows: 1, rating: 1, totalRating: 1 },
    { name: 'Game2', follows: 2, rating: 2, totalRating: 2 },
    { name: 'Game3', follows: 3, rating: 3, totalRating: 3 },
    { name: 'Game4', follows: 4, rating: 4, totalRating: 4 },
    { name: 'Game5', follows: 5, rating: 5, totalRating: 5 },
    { name: 'Game6', follows: 6, rating: 6, totalRating: 6 },
    { name: 'Game7', follows: 7, rating: 7, totalRating: 7 },
    { name: 'Game8', follows: 8, rating: 8, totalRating: 8 },
    { name: 'Game9', follows: 9, rating: 9, totalRating: 9 },
    { name: 'Game10', follows: 10, rating: 10, totalRating: 10 },
  ];
  const mockedIgdbApiService = {
    getAllGamesPaginated: ({ skip, limit }: { skip: number; limit: number }) =>
      mockedIgdbApiServiceDataStore.slice(skip, skip + limit),
    getSpecificGame: ({
      payload,
      skip,
      limit,
    }: {
      payload: GetSpecificGameDTO;
      skip: number;
      limit: number;
    }) => {
      let result = mockedIgdbApiServiceDataStore;
      if (payload?.followers) {
        result = result.filter((item) => item.follows >= payload.followers);
      }

      if (payload?.name) {
        result = result.filter((item) => item.name === payload.name);
      }

      if (payload?.rating) {
        result = result.filter((item) => item.rating >= payload.rating);
      }

      if (payload?.totalRating) {
        result = result.filter(
          (item) => item.totalRating >= payload.totalRating,
        );
      }
      return result.slice(skip, skip + limit);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IgdbApiController],
      providers: [{ provide: IgdbApiService, useValue: mockedIgdbApiService }],
    }).compile();

    controller = module.get<IgdbApiController>(IgdbApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all games paginated to 5 items', async () => {
    const response = await controller.getAllGamesPaginated(0, 5);
    expect(response?.length).toBeLessThanOrEqual(5);

    response.forEach((item) => {
      expect(item.name).toBeDefined();
    });
  });

  it('should return specific game with name=Game1', async () => {
    const response = await controller.getSpecificGame({ name: 'Game1' }, 0, 5);

    expect(response?.length).toBeLessThanOrEqual(5);
    expect(response[0].name).toBe('Game1');
  });

  it('should return specific game with name=Game1, followers>=2', async () => {
    const response = await controller.getSpecificGame(
      { name: 'Game1', followers: 2 },
      0,
      5,
    );

    // Since there is no game with this name and followers
    expect(response?.length).toBe(0);
  });

  it('should return specific game with followers>=2', async () => {
    const response = await controller.getSpecificGame({ followers: 2 }, 0, 5);

    // Since there is no game with this name and followers
    expect(response?.length).toBeLessThanOrEqual(5);
    response.forEach((item) => {
      expect(item.follows).toBeGreaterThanOrEqual(2);
    });
  });

  it('should return specific game with rating>=5', async () => {
    const response = await controller.getSpecificGame({ rating: 5 }, 0, 5);

    // Since there is no game with this name and followers
    expect(response?.length).toBeLessThanOrEqual(5);
    response.forEach((item) => {
      expect(item.rating).toBeGreaterThanOrEqual(5);
    });
  });

  it('should return specific game with totalRating>=3', async () => {
    const response = await controller.getSpecificGame({ totalRating: 3 }, 0, 5);

    // Since there is no game with this name and followers
    expect(response?.length).toBeLessThanOrEqual(5);
    response.forEach((item) => {
      expect(item.rating).toBeGreaterThanOrEqual(3);
    });
  });
});
