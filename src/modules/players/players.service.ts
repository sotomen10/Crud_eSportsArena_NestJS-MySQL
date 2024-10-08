import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Players } from './entities/player.entity';
import { CrudPlayers } from './interface/players.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { FindById } from 'src/common/dto/find-by-id.dto';
import { Tournament } from '../tournamet/entities/tournamet.entity';

@Injectable()
export class PlayersService implements CrudPlayers {
  constructor(@InjectRepository(Players) private playersRepository: Repository<Players>) { }
  @InjectRepository(Tournament) private tournamentRepository: Repository<Tournament>

  async createPlayer(createPlayer: CreatePlayerDto): Promise<Players> {
    try {
      const { password, confirmPassword, roles, ...rest } = createPlayer;

      if (password !== confirmPassword) {
        throw new BadRequestException('The keys do not match; ensure that confirm password is correct.');
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newPlayer = this.playersRepository.create({
        ...rest,
        password: encryptedPassword,
        roles: roles.map(roleId => ({ id: roleId })),
      });

      return await this.playersRepository.save(newPlayer);
    } catch (error) {
      console.log('Error in the service creating the player:', error.message);
      if (error.code === '23505') {
        throw new ConflictException('The email is already in use.');
      }
      throw new InternalServerErrorException('Error creating the player; please try again later.');
    }
  }

  async findAll(pagination: PaginationDTO): Promise<{
    total: number;
    page: number;
    limit: number;
    players: Players[];
  }> {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      const [players, total] = await this.playersRepository.findAndCount({
        skip,
        take: limit,
        relations: ['roles', 'tournaments']
      });

      return {
        total,
        page,
        limit,
        players,
      };
    } catch (error) {
      console.log('Error from service of findAll players:', error.message);
      throw new InternalServerErrorException('Error fetching players; please try again later.');
    }
  }

  async findOne(idObject: FindById): Promise<Players> {
    try {
      const playerFound = await this.playersRepository.findOne({
        where: { id: idObject.id },
        relations: ['roles', 'tournaments']
      });
      if (!playerFound) {
        throw new NotFoundException(`Player with id ${idObject.id} was not found; ensure that the id is correct.`);
      }
      return playerFound;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error finding player:', error.message);
      throw new InternalServerErrorException('Error finding the player; please try again later.');
    }
  }

  async update(idObject: FindById, updatePlayer: UpdatePlayerDto): Promise<Players> {
    try {
      const player = await this.playersRepository.findOne({ where: { id: idObject.id } });
      if (!player) {
        throw new NotFoundException(`Player with id ${idObject.id} was not found.`);
      }

      if (updatePlayer.password) {
        const { password, confirmPassword } = updatePlayer;

        if (password !== confirmPassword) {
          throw new BadRequestException('Password and confirm password do not match.');
        }

        updatePlayer.password = await bcrypt.hash(password, 10);
      }

      Object.assign(player, updatePlayer);

      await this.playersRepository.save(player);

      return await this.playersRepository.findOne({
        where: { id: idObject.id },
        relations: ['roles', 'tournaments']
      });
    } catch (error) {
      console.error('Error updating player:', error.message);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating the player; please try again later.');
    }
  }

  async remove(idObject: FindById): Promise<{ message: string }> {
    try {
      const player = await this.playersRepository.findOne({ where: { id: idObject.id } });
      if (!player) {
        throw new NotFoundException(`Player with id ${idObject.id} was not found.`);
      }

      await this.playersRepository.delete(idObject);

      return { message: `Player with id ${idObject.id} was successfully deleted.` };
    } catch (error) {
      console.error('Error deleting player:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting the player; please try again later.');
    }
  }

  async findByEmail(email: string): Promise<Players> {
    try {
      const player = await this.playersRepository.findOne({
        where: { email },
        relations: ['roles'],
      });

      return player;
    } catch (error) {
      console.error('Error finding player by email:', error.message);
      throw new InternalServerErrorException('Error finding the player by email; please try again later.');
    }
  }

  async matchPlayerToRandomTournament(playerId: string): Promise<{ message: string; tournamentName: string; playerNickname: string }> {
    try {

      const player = await this.playersRepository.findOne({
        where: { id: playerId },
        relations: ['tournaments'],
      });

      if (!player) {
        throw new NotFoundException('Player not found');
      }


      const tournaments = await this.tournamentRepository.find();

      if (tournaments.length === 0) {
        throw new NotFoundException('No tournaments available');
      }

      let randomTournament;
      let tries = 0;
      const maxTries = 5;

      do {
        randomTournament = tournaments[Math.floor(Math.random() * tournaments.length)];
        tries++;
      } while (player.tournaments.some(t => t.id === randomTournament.id) && tries < maxTries);


      if (player.tournaments.some(t => t.id === randomTournament.id)) {
        throw new ConflictException('No unassigned tournaments available for this player');
      }


      player.tournaments.push(randomTournament);


      await this.playersRepository.save(player);


      return {
        message: 'Player successfully matched to a random tournament.',
        tournamentName: randomTournament.name,
        playerNickname: player.nickname,
      };
    } catch (error) {
      console.error('Error in matching player to tournament:', error);
      throw new InternalServerErrorException(`Error matching player to tournament: ${error.message}`);
    }
  }



}

