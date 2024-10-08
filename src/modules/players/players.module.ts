import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Players } from './entities/player.entity';
import { Role } from 'src/auth/entities/roles.entity';
import { Tournament } from '../tournamet/entities/tournamet.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Players,Role,Tournament])],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
