import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';
import applicationConfig from '../config/application.config';
import { IJWTPayload } from '../interface/jwt-payload.interface';
import { CreateUserDTO } from './dtos/create-user.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { LoginUserDTO } from './dtos/login-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
    private jwtService: JwtService,
  ) {}

  /**
   * This method will create a new user in DB
   * @param payload CreateUserDTO
   * @returns JWT token
   */
  async createUser(payload: CreateUserDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepo.findOne({
      where: { email: payload?.email },
    });
    if (user?.email) {
      throw new BadRequestException({ message: 'User is already created' });
    }

    try {
      const plainTextPassword = payload.password;
      payload.password = await bcrypt.hash(payload.password, 12);
      await this.userRepo.save(this.userRepo.create(payload));

      return this.login({ email: payload.email, password: plainTextPassword });
    } catch (error) {
      Logger.error(`${error}`);
      throw new InternalServerErrorException({
        message: 'Something went wrong while creating user',
      });
    }
  }

  /**
   * Login user with email and password
   * @param payload LoginUserDTO
   * @returns JWT token
   */
  async login(payload: LoginUserDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepo.findOne({
      where: { email: payload?.email },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
      });
    }

    const passwordMatched = await bcrypt
      .compare(payload.password, user.password)
      .catch(() => null);

    if (!passwordMatched) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
      });
    }

    try {
      if (passwordMatched) {
        const jwtPayload: IJWTPayload = { userId: user.id, email: user.email };
        const token = await this.jwtService.signAsync(jwtPayload, {
          secret: this.appConfig.apiAuth.secretToken,
        });
        return { token };
      }
    } catch (error) {
      Logger.error(`${error}`);
      throw new InternalServerErrorException({
        message: 'Something went wrong while logging you in',
      });
    }
  }

  /**
   * Find single user based on query
   * @param query FindOneOptions<UserEntity>
   * @returns UserEntity
   */
  async findOne(query: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return this.userRepo.findOne(query);
  }
}
