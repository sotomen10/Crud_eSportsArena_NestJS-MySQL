import { HttpException, Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { login } from './dto/login-auth.dto';
import { Players } from '../modules/players/entities/player.entity';
import { AuthInterface } from './interface/auth.interface';
import { PlayersService} from '../modules/players/players.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreatePlayerDto } from '../modules/players/dto/create-player.dto';

@Injectable()
export class AuthService implements AuthInterface {
  constructor(
    private readonly playersService: PlayersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(data: login): Promise<{ alldata: Players; accessToken: string }> {
    try {
      const user = await this.playersService.findByEmail(data.email);
      if (!user) {
        throw new HttpException(`User with email ${data.email} not found`, 404);
      }

      const isPasswordValid = await compare(data.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect credentials');
      }

      const fullUser = await this.playersService.findOne({ id: user.id });

      const payload = {
        id: fullUser.id,
        email: fullUser.email,
        roles: fullUser.roles.map(role => ({
          id: role.id,
          name: role.name,
        })),
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        alldata: fullUser,
        accessToken,
      };
    } catch (error) {
      if (error instanceof HttpException || error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An error occurred while signing in');
      }
    }
  }

  async register(data: CreatePlayerDto): Promise<Players> {
    try {
      return await this.playersService.createPlayer(data);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }

  async generateJwtToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async googleAuthUser(email: string, fullName: string, roles: number[], age: number): Promise<{ alldata: Players; accessToken: string }> {
    try {
        let user = await this.playersService.findByEmail(email);

        if (!user) {
            const defaultPassword = 'defaultPassword123';
            user = await this.playersService.createPlayer({
                nickname: 'defaultNickname', 
                fullname: fullName, 
                email,
                age, 
                password: defaultPassword,
                confirmPassword: defaultPassword,
                whatsapp: 0, 
                roles,
            });
        }

        const payload = {
            id: user.id,
            email: user.email,
            roles: user.roles.map(role => ({
                id: role.id,
                name: role.name,
            })),
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            alldata: user,
            accessToken,
        };
    } catch (error) {
        throw new InternalServerErrorException('An error occurred during Google authentication');
    }
  }
}
