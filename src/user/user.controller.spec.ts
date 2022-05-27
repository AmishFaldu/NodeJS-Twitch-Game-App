import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dtos/create-user.dto';
import { LoginUserDTO } from './dtos/login-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockedUserServiceDatastore = [];
  const mockedUserService = {
    createUser: async (payload: CreateUserDTO) => {
      const user = mockedUserServiceDatastore.find(
        (user) => user.email === payload.email,
      );

      if (user) {
        throw new BadRequestException({ message: 'User is already created' });
      }

      payload.password = await bcrypt.hash(payload.password, 12);
      mockedUserServiceDatastore.push({ ...payload, id: payload.email });
      return { token: 'JWT token' };
    },
    login: async (payload: LoginUserDTO) => {
      const user = mockedUserServiceDatastore.find(
        (user) => user.email === payload.email,
      );

      if (!user) {
        throw new UnauthorizedException({
          message: 'Invalid email or password',
        });
      }

      const passwordMatched = await bcrypt
        .compare(payload.password, user.password)
        .catch(() => null);

      if (passwordMatched) {
        return { token: 'JWT token' };
      } else {
        throw new UnauthorizedException({
          message: 'Invalid email or password',
        });
      }
    },
  };

  beforeEach(async () => {
    // Clear all data stored
    mockedUserServiceDatastore = [];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockedUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const response = await controller.signupNewUser({
      email: 'test@test.com',
      password: 'test',
    });

    expect(response.token).toBeDefined();
  });

  it('should throw error for creating multiple same user', async () => {
    const response = await controller.signupNewUser({
      email: 'test@test.com',
      password: 'test',
    });

    expect(response.token).toBeDefined();

    await expect(
      controller.signupNewUser({
        email: 'test@test.com',
        password: 'test',
      }),
    ).rejects.toThrow('User is already created');
  });

  it('should login existing user', async () => {
    await controller.signupNewUser({
      email: 'test@test.com',
      password: 'test',
    });

    const response = await controller.loginUser({
      email: 'test@test.com',
      password: 'test',
    });
    expect(response.token).toBeDefined();
  });

  it('should throw error on invalid login creds for existing user', async () => {
    await controller.signupNewUser({
      email: 'test@test.com',
      password: 'test',
    });

    await expect(
      controller.loginUser({
        email: 'test@test.com',
        password: 'test1',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw error on login creds for non existing user', async () => {
    await expect(
      controller.loginUser({
        email: 'test@test.com',
        password: 'test1',
      }),
    ).rejects.toThrow('Invalid email or password');
  });
});
