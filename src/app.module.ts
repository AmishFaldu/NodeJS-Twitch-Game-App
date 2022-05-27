import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import applicationConfig from './config/application.config';
import { envValidationSchema } from './config/validation.schema';
import { GameModule } from './game/game.module';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { IgdbApiModule } from './igdb-api/igdb-api.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (appConfig: ConfigType<typeof applicationConfig>) => ({
        secret: appConfig.apiAuth.secretToken,
      }),
      inject: [applicationConfig.KEY],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [applicationConfig.KEY],
      useFactory: (appConfig: ConfigType<typeof applicationConfig>) => ({
        type: 'postgres',
        synchronize: false, // NOTE - Keep this flag to false everywhere. To change entities in DB generate and run migrations
        url: appConfig.postgresDB.url,
        autoLoadEntities: true, // This flag will load all the entities from TypeORMModule.forFeature() to DB
        migrations: [`${__dirname}/dist/migrations/**/*.ts`], // Specifies the migrations files in glob format
        ssl: appConfig.postgresDB.sslEnabled
          ? { ca: appConfig.postgresDB.sslCACert }
          : false,
      }),
    }),
    IgdbApiModule,
    GameModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: 'APP_PIPE', useClass: ValidationPipe },
    { provide: 'APP_GUARD', useClass: JWTAuthGuard },
  ],
})
export class AppModule {}
