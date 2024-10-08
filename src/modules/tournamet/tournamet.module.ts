import { Module } from '@nestjs/common';
import { TournametService } from './tournamet.service';
import { TournamentController } from './tournamet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournamet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament])],
  controllers: [TournamentController],
  providers: [TournametService],
})
export class TournametModule {}
