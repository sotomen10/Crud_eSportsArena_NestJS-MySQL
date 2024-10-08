import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerInterface } from './interfaces/player.interface';
import { Player } from './entities/player.entity';
// import { Role } from '../../auth/entities/roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { FindById } from './dto/find-by-id.dto';

@Injectable()
export class PlayersService implements PlayerInterface {
  constructor(
    @InjectRepository(Player) private playerRepositori: Repository<Player>,
    // @InjectRepository(Role) private roleRepository: Repository<Role> 
  ) {}

  async create(createPlayer: CreatePlayerDto): Promise<Player> {
    try {
      const { password, confirmPassword, roles: roleIds } = createPlayer;
      const encryptedPassword = await bcrypt.hash(password, 10);

      if (password === confirmPassword) {
        
        const roles = await this.roleRepository.findBy({ id: In(roleIds) });
        if (roles.length !== roleIds.length) {
          throw new BadRequestException('Some roles were not found.');
        }

        
        const player = this.playerRepositori.create({
          ...createPlayer,
          password: encryptedPassword,
          roles,  
        });

        const playersaved = await this.playerRepositori.save(player);
        return playersaved;
      } else {
        throw new BadRequestException('Ensure that confirm password and password is the same');
      }
    } catch (error) {
      console.log('Error from service of create player:', error.message);
      throw new InternalServerErrorException('Error creating the player from service');
    }
  }

  async findAll(pagination: PaginationDTO): Promise<{
    total: number;
    page: number;
    limit: number;
    players: Player[];
  }> {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const [players, total] = await this.playerRepositori.findAndCount({
        skip,
        take: limit,
        relations: ['roles'],  
      });
      return {
        total,
        page,
        limit,
        players,
      };
    } catch (error) {
      console.log('Error from service of findAll players:', error.message);
    }
  }

  async findOne(idObject: FindById): Promise<Player> {
    try {
  
      const playerFinded = await this.playerRepositori.findOne({
        where: { id: idObject.id },
        relations: ['roles'],  
      });
      if (!playerFinded) {
        throw new NotFoundException(`Player with id ${idObject.id} was not found, ensure that the id is correct`);
      }
      return playerFinded;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error finding player:', error.message);
      throw new InternalServerErrorException('Error finding the player. Please try again later.');
    }
  }

  async update(idObject: FindById, updatePlayer: UpdatePlayerDto): Promise<Player> {
    try {
      const player = await this.playerRepositori.findOne({ where: { id: idObject.id }, relations: ['roles'] });
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

      
      if (updatePlayer.roles) {
        const roles = await this.roleRepository.findBy({ id: In(updatePlayer.roles) });
        if (roles.length !== updatePlayer.roles.length) {
          throw new BadRequestException('Some roles were not found.');
        }
        player.roles = roles;
      }

      await this.playerRepositori.save(player); 

      const updatedPlayer = await this.playerRepositori.findOne({
        where: { id: idObject.id },
        relations: ['roles'],
      });
      if (!updatedPlayer) {
        throw new InternalServerErrorException('Failed to retrieve updated player.');
      }

      return updatedPlayer;
    } catch (error) {
      console.error('Error updating player:', error.message);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating the player. Please try again later.');
    }
  }

  async remove(idObject: FindById): Promise<{ message: string }> {
    try {
      const player = await this.playerRepositori.findOne({ where: { id: idObject.id }, relations: ['roles'] });
      if (!player) {
        throw new NotFoundException(`Player with id ${idObject.id} was not found.`);
      }

      await this.playerRepositori.delete(idObject);

      return { message: `Player with id ${idObject.id} was successfully deleted.` };
    } catch (error) {
      console.error('Error deleting player:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting the player. Please try again later.');
    }
  }

  async findByEmail(email: string): Promise<Player> {
    try {
      const player = await this.playerRepositori.findOne({
        where: { email },
        relations: ['roles']
      });
      
      return player;
    } catch (error) {
      console.error('Error finding player by email:', error.message);
      throw new InternalServerErrorException('Error finding the player by email. Please try again later.');
    }
  }

}
