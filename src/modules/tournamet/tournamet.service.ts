import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTournametDto } from './dto/create-tournamet.dto';
import { UpdateTournametDto } from './dto/update-tournamet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournamet.entity';
import { Repository } from 'typeorm';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class TournametService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async createTournament(createTournament: CreateTournametDto): Promise<Tournament> {
    try {
      const tournament = this.tournamentRepository.create(createTournament);
      return await this.tournamentRepository.save(tournament);
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw new InternalServerErrorException('Error creating tournament, please try again.');
    }
  }

  async getTournamentById(id: string): Promise<Tournament> {
    try {
      const tournament = await this.tournamentRepository.findOne({ where: { id } });
      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }
      return tournament;
    } catch (error) {
      console.error('Error fetching tournament by ID:', error);
      throw new InternalServerErrorException('Error fetching tournament, please try again.');
    }
  }

  async getAllTournaments(paginationDto: PaginationDTO): Promise<{ tournaments: Tournament[], total: number }> {
    const { page, limit } = paginationDto;

    try {
      const [tournaments, total] = await this.tournamentRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations:['players']
      });

      return { tournaments, total };
    } catch (error) {
      console.error('Error fetching tournaments with pagination:', error);
      throw new InternalServerErrorException('Error fetching tournaments, please try again.');
    }
  }

  async updateTournament(id: string, updateTournamentDto: Partial<CreateTournametDto>): Promise<Tournament> {
    try {
      await this.tournamentRepository.update(id, updateTournamentDto);
      const updatedTournament = await this.getTournamentById(id);
      return updatedTournament;
    } catch (error) {
      console.error('Error updating tournament:', error);
      throw new InternalServerErrorException('Error updating tournament, please try again.');
    }
  }

  async deleteTournament(id: string): Promise<void> {
    try {
      const result = await this.tournamentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Tournament not found');
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      throw new InternalServerErrorException('Error deleting tournament, please try again.');
    }
  }
}
