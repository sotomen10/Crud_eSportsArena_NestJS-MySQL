import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Players } from './entities/player.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Players])],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
