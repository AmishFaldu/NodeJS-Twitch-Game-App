import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  // Increased timeout for tests that take long to run
  jest.setTimeout(10000);

  // Setup application before testing begins
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const payload: CreateUserDTO = {
      email: 'test@test.com',
      password: 'test',
    };
    const response = await request(app.getHttpServer())
      .post('/user/signup')
      .send(payload);
    token = response.body.token;
  });

  // Clean database before each test runs
  beforeEach(async () => {
    const connection = getConnection();
    await connection.query('delete from "game"');
  });

  // Clean up all the resources after doing testing
  afterAll(async () => {
    const connection = getConnection();
    await connection.query('delete from "game"');
    await connection.query('delete from "user"');
  });

  describe('Health Check API (GET)', () => {
    it('/health-check', async () => {
      const response = await request(app.getHttpServer()).get('/health-check');

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({ message: 'I am healthy' });
    });
  });

  describe('Get all IGDB games API (GET)', () => {
    it('Get all IGDB games, without skip and without limit and without token', async () => {
      const response = await request(app.getHttpServer()).get(
        '/igdb-api/get-all-games',
      );

      console.log(response.body);
      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('Get all IGDB games, without skip and without limit and with empty token data', async () => {
      const response = await request(app.getHttpServer())
        .get('/igdb-api/get-all-games')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTE0OTM3OTV9.EklSYkFCfh3dpXnY4xLDAvltGKy5pqqC45WqGu3MmYU',
        );

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('Get all IGDB games, without skip and without limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/igdb-api/get-all-games')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all IGDB games, with skip and without limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/igdb-api/get-all-games?skip=0')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all IGDB games, without skip and with limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/igdb-api/get-all-games?limit=1')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all IGDB games, with value skip value and with invalid limit value', async () => {
      const response = await request(app.getHttpServer())
        .get('/igdb-api/get-all-games?limit=false&skip=0')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all IGDB games, with invalid skip value and with value limit value', async () => {
      const response = await request(app.getHttpServer())
        .get('/igdb-api/get-all-games?limit=10&skip=hello')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all IGDB games, with invalid skip value and with invalid limit value', async () => {
      const response = await request(app.getHttpServer())
        .get('/igdb-api/get-all-games?limit=false&skip=hello')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all IGDB games, skip=0 & limit=10', async () => {
      const response = await request(app.getHttpServer())
        .get('/igdb-api/get-all-games?skip=0&limit=10')
        .set('authorization', token);

      expect(response.statusCode).toBe(200);
      expect(response.body?.length).toBeLessThanOrEqual(10);
    });

    it('Get all IGDB games, skip=0 & limit=1', async () => {
      const response = await request(app.getHttpServer())
        .get('/igdb-api/get-all-games?skip=0&limit=1')
        .set('authorization', token);

      expect(response.statusCode).toBe(200);
      expect(response.body?.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Get specific games IGDB (POST)', () => {
    it('Get specific games, without skip and without limit and without token', async () => {
      const response = await request(app.getHttpServer()).post(
        '/igdb-api/get-specific-game',
      );

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('Get specific games, without skip and without limit and with empty token', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTE0OTM3OTV9.EklSYkFCfh3dpXnY4xLDAvltGKy5pqqC45WqGu3MmYU',
        );

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('Get specific games, without skip and without limit', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      });
    });

    it('Get specific games, with skip and without limit', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?skip=0')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get specific games, without skip and with limit', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?limit=1')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get specific games, with value skip value and with invalid limit value', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?limit=false&skip=0')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get specific games, with invalid skip value and with value limit value', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?limit=10&skip=hello')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get specific games, with invalid skip value and with invalid limit value', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?limit=false&skip=hello')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get specific games, skip=0 & limit=1', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?skip=0&limit=1')
        .set('authorization', token);

      expect(response.statusCode).toBe(201);
      expect(response.body?.length).toBeLessThanOrEqual(1);
      expect(response.body[0]?.name).toBeDefined();
    });

    it('Get specific games, skip=0 & limit=1 with name=The Fifth Expedition', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?skip=0&limit=1')
        .set('authorization', token)
        .send({ name: 'The Fifth Expedition' });

      expect(response.statusCode).toBe(201);
      expect(response.body?.length).toBeLessThanOrEqual(1);
      expect(response.body[0]?.name).toBe('The Fifth Expedition');
    });

    it('Get specific games, skip=0 & limit=3 with followers=1', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?skip=0&limit=3')
        .set('authorization', token)
        .send({ followers: 1 });

      expect(response.statusCode).toBe(201);
      expect(response.body?.length).toBeLessThanOrEqual(3);
      response.body.forEach((game) => {
        expect(game.follows).toBeGreaterThanOrEqual(1);
      });
    });

    it('Get specific games, skip=0 & limit=3 with rating=1', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?skip=0&limit=3')
        .set('authorization', token)
        .send({ rating: 1 });

      expect(response.statusCode).toBe(201);
      expect(response.body?.length).toBeLessThanOrEqual(3);
      response.body.forEach((game) => {
        expect(game.rating).toBeGreaterThanOrEqual(1);
      });
    });

    it('Get specific games, skip=0 & limit=3 with totalRating=1', async () => {
      const response = await request(app.getHttpServer())
        .post('/igdb-api/get-specific-game?skip=0&limit=3')
        .set('authorization', token)
        .send({ totalRating: 1 });

      expect(response.statusCode).toBe(201);
      expect(response.body?.length).toBeLessThanOrEqual(3);
      response.body.forEach((game) => {
        expect(game.total_rating).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Add favourite game (POST)', () => {
    it('Add favourite game, without name and without token', async () => {
      const response = await request(app.getHttpServer()).post(
        '/game/add-favourite-game',
      );

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('Add favourite game, without name and with empty token', async () => {
      const response = await request(app.getHttpServer())
        .post('/game/add-favourite-game')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTE0OTM3OTV9.EklSYkFCfh3dpXnY4xLDAvltGKy5pqqC45WqGu3MmYU',
        );

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('Add favourite game, without name', async () => {
      const response = await request(app.getHttpServer())
        .post('/game/add-favourite-game')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        message: ['name should not be empty', 'name must be a string'],
      });
    });

    it('Add favourite game, with name for wrong user', async () => {
      const response = await request(app.getHttpServer())
        .post('/game/add-favourite-game')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzFjZjI2MC0yZDA5LTQ1OGEtYjA4Mi05ODJlZTljMGM3ZWUiLCJlbWFpbCI6ImFtaXNoQGdtYWlsLmNvbSIsImlhdCI6MTY1MTQ5Mzc5NX0.6WuDLiXT03q8VGZCXruOEJumCnoHZHxB1ooreVsgcHI',
        )
        .send({ name: 'The Fifth Expedition' });

      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        message: 'Unauthorized to perform this operation',
      });
    });

    it('Add favourite game, with name=The Fifth Expedition', async () => {
      const response = await request(app.getHttpServer())
        .post('/game/add-favourite-game')
        .set('authorization', token)
        .send({ name: 'The Fifth Expedition' });

      expect(response.statusCode).toBe(201);
      expect(response.body?.name).toBe('The Fifth Expedition');
    });

    it('Add favourite game, with name=Dogou Souken adding second time should send already exists message', async () => {
      await request(app.getHttpServer())
        .post('/game/add-favourite-game')
        .set('authorization', token)
        .send({ name: 'Dogou Souken' });

      const response = await request(app.getHttpServer())
        .post('/game/add-favourite-game')
        .set('authorization', token)
        .send({ name: 'Dogou Souken' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        message: 'Game already in favourites',
      });
    });

    it('Add favourite game, with name=The Fifth Expeditiongfsdhfdsh should send not found message', async () => {
      const response = await request(app.getHttpServer())
        .post('/game/add-favourite-game')
        .set('authorization', token)
        .send({ name: 'The Fifth Expeditiongfsdhfdsh' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        message: 'Game with that name not found!',
      });
    });
  });

  describe('Get all favourite games (GET)', () => {
    it('Get all favourite games, without skip and without limit and without token', async () => {
      const response = await request(app.getHttpServer()).get('/game');

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('Get all favourite games, without skip and without limit and with empty token', async () => {
      const response = await request(app.getHttpServer())
        .get('/game')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTE0OTM3OTV9.EklSYkFCfh3dpXnY4xLDAvltGKy5pqqC45WqGu3MmYU',
        );

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      });
    });

    it('Get all favourite games, without skip and without limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/game')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all favourite games, with skip and without limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/game?skip=0')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all favourite games, without skip and with limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/game?limit=1')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all favourite games, with value skip value and with invalid limit value', async () => {
      const response = await request(app.getHttpServer())
        .get('/game?limit=false&skip=0')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all favourite games, with invalid skip value and with value limit value', async () => {
      const response = await request(app.getHttpServer())
        .get('/game?limit=10&skip=hello')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all favourite games, with invalid skip value and with invalid limit value', async () => {
      const response = await request(app.getHttpServer())
        .get('/game?limit=false&skip=hello')
        .set('authorization', token);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      });
    });

    it('Get all favourite games, skip=0 & limit=10', async () => {
      const response = await request(app.getHttpServer())
        .get('/game?skip=0&limit=10')
        .set('authorization', token);

      expect(response.statusCode).toBe(200);
      expect(response.body?.length).toBeLessThanOrEqual(10);
    });

    it('Get all favourite games, skip=0 & limit=1', async () => {
      const response = await request(app.getHttpServer())
        .get('/game?skip=0&limit=1')
        .set('authorization', token);

      expect(response.statusCode).toBe(200);
      expect(response.body?.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Signup API (POST)', () => {
    // Clean DB before running every test
    beforeEach(async () => {
      const connection = getConnection();
      await connection.query('delete from "game"');
      await connection.query('delete from "user"');
    });

    it('Signup API, create new user', async () => {
      const payload: CreateUserDTO = {
        email: 'test@test.com',
        password: 'test',
      };
      const response = await request(app.getHttpServer())
        .post('/user/signup')
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body?.token).toBeDefined();
    });

    it('Signup API, error on creating multiple users with same details', async () => {
      const payload: CreateUserDTO = {
        email: 'test@test.com',
        password: 'test',
      };
      await request(app.getHttpServer()).post('/user/signup').send(payload);

      const response = await request(app.getHttpServer())
        .post('/user/signup')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        message: 'User is already created',
      });
    });
  });

  describe('Login API (POST)', () => {
    // Clean DB before running every test
    beforeEach(async () => {
      const connection = getConnection();
      await connection.query('delete from "game"');
      await connection.query('delete from "user"');
    });

    it('Login API, login with valid creds', async () => {
      const payload: CreateUserDTO = {
        email: 'test@test.com',
        password: 'test',
      };
      await request(app.getHttpServer()).post('/user/signup').send(payload);

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body?.token).toBeDefined();
    });

    it('Login API, login with invalid password', async () => {
      const payload: CreateUserDTO = {
        email: 'test@test.com',
        password: 'test',
      };
      await request(app.getHttpServer()).post('/user/signup').send(payload);

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({ email: payload.email, password: 'abcd' });

      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        message: 'Invalid email or password',
      });
    });

    it('Login API, login with invalid email', async () => {
      const payload: CreateUserDTO = {
        email: 'test@test.com',
        password: 'test',
      };
      await request(app.getHttpServer()).post('/user/signup').send(payload);

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({ email: 'test1@test2.com', password: payload.password });

      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        message: 'Invalid email or password',
      });
    });
  });
});
