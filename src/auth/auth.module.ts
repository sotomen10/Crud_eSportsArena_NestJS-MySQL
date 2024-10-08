import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Players } from '../modules/players/entities/player.entity'; 
import { Role } from './entities/roles.entity';
import { JwtModule } from '@nestjs/jwt';
import { PlayersService } from '../modules/players/players.service'; 
import { JwtStrategyRols } from './strategy/rols.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { Tournament } from 'src/modules/tournamet/entities/tournamet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Players, Role,Tournament]), 
    JwtModule.register({  
      global: true,
      secret: process.env.JWT_SECRET_APPI,
      signOptions: { expiresIn: process.env.EXPIRESIN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PlayersService, JwtStrategyRols, GoogleStrategy],
})
export class AuthModule {}

