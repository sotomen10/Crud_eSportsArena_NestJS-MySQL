import { Controller, Get, Post, Body, Query, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { CreatePlayerPipe } from './pipes/create-player.pipe';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { PaginationValidationPipe } from 'src/common/pipes/pagination.pipe';
import { FindById } from './dto/find-by-id.dto';
import { FindByIdPipeCustom } from './pipes/fin-by-id.pipe';
import { UpdatePlayerPipe } from './pipes/update-player.pipe';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import { RolesGuard } from 'src/auth/guards/jwt-roles.guard';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { PlayersService } from './players.service';

@ApiTags('Players') 
@ApiBearerAuth() 
// @UseGuards(JwtAuthGuard)
@Controller('playerss')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of players', type: [CreatePlayerDto] }) 
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' }) 
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit of players per page' })
  findAll(@Query(PaginationValidationPipe) Pagination: PaginationDTO) {
    return this.playersService.findAll(Pagination);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Player found', type: CreatePlayerDto }) 
  @ApiResponse({ status: 404, description: 'Player not found' }) 
  @ApiParam({ name: 'id', type: String, description: 'Player ID' }) 
  findOne(@Param(FindByIdPipeCustom) id: FindById) {
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Player updated', type: CreatePlayerDto }) 
  @ApiResponse({ status: 404, description: 'Player not found' }) 
  @ApiParam({ name: 'id', type: String, description: 'Player ID' }) 
  @ApiBody({ type: UpdatePlayerDto }) // Cuerpo de la solicitud
  update(@Param(FindByIdPipeCustom) id: FindById, @Body(UpdatePlayerPipe) updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Player removed' }) 
  @ApiResponse({ status: 404, description: 'Player not found' }) 
  @ApiParam({ name: 'id', type: String, description: 'Player ID' })
  remove(@Param(FindByIdPipeCustom) id: FindById) {
    return this.playersService.remove(id);
  }
}
