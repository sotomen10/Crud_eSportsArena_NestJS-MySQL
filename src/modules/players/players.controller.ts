import { Controller, Get, Post, Body, Patch, Param, Delete ,Query, UseGuards} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { PaginationValidationPipe } from 'src/common/pipes/paginations.pipe';
import { FindByIdPipeCustom } from 'src/common/pipes/find-by-id.pipe';
import { FindById } from 'src/common/dto/find-by-id.dto';
import { UpdatePlayerPipe } from './pipes/update-player.pipe';
import { CreatePlayerPipe } from './pipes/create-player.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/jwt-roles.guard';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  create(@Body(CreatePlayerPipe) createPlayerDto: CreatePlayerDto) {
    return this.playersService.createPlayer(createPlayerDto);
  }

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
}
