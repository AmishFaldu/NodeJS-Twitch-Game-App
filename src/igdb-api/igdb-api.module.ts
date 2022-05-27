import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IgdbApiController } from './igdb-api.controller';
import { IgdbApiService } from './igdb-api.service';

@Module({
  imports: [ConfigModule],
  providers: [IgdbApiService],
  controllers: [IgdbApiController],
  exports: [IgdbApiService],
})
export class IgdbApiModule {}
