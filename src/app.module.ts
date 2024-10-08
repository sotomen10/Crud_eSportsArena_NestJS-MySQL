import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModuleCustom } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { PlayersModule } from './modules/players/players.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/general-exceptions.filter';
import { AuthModule } from './auth/auth.module';
import { TournametModule } from './modules/tournamet/tournamet.module';

@Module({
  imports: [ConfigModuleCustom,
    AuthModule,
    TypeOrmModule.forRoot({ 
      type:'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
      synchronize: true,}),
    PlayersModule,
    TournametModule,

  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide:APP_FILTER,
      useClass:AllExceptionsFilter
    }


  ],
})
export class AppModule {}
