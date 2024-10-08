import { Controller, Get, Post, Body, Patch, Param, Delete ,Query, UseGuards, HttpCode, HttpStatus} from '@nestjs/common';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { PaginationValidationPipe } from 'src/common/pipes/paginations.pipe';
import { FindByIdPipeCustom } from 'src/common/pipes/find-by-id.pipe';
import { FindById } from 'src/common/dto/find-by-id.dto';
import { UpdatePlayerPipe } from './pipes/update-player.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/jwt-roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(@Query(PaginationValidationPipe) Pagination: PaginationDTO) {
    return this.playersService.findAll(Pagination);
  }

  @Get(':id')
  findOne(@Param('id',new FindByIdPipeCustom()) id:FindById) {
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',new FindByIdPipeCustom()) id:FindById, @Body(UpdatePlayerPipe) updatePlayer: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayer);
  }

  @Delete(':id')
  remove(@Param('id',new FindByIdPipeCustom()) id:FindById) {
    return this.playersService.remove(id);
  }

  @Patch(':id/match-random-tournament')
  @HttpCode(HttpStatus.OK)
  async matchPlayerToRandomTournament(@Param('id') playerId: string): Promise<{ message: string }> {
    return this.playersService.matchPlayerToRandomTournament(playerId);
  }
}
