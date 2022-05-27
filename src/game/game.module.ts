import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IgdbApiModule } from '../igdb-api/igdb-api.module';
import { UserModule } from '../user/user.module';
import { GameEntity } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), IgdbApiModule, UserModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
