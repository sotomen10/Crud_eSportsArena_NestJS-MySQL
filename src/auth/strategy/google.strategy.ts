import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PlayersService } from '../../modules/players/players.service'; 
import { Players } from '../../modules/players/entities/player.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly playersService: PlayersService) {
    super({
      clientID: process.env.ID_GOOGLE_CLIENT,  
      clientSecret: process.env.SECRET_OF_CLIENT_GOOGLE,  
      callbackURL: process.env.GOOGLE_CALLBACK_URI || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],  
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;

    try {
      
      let player: Players = await this.playersService.findByEmail(emails[0].value);

     
      if (!player) {
        player = await this.playersService.createPlayer({
          nickname: 'defaultNickname', 
          fullname: `${name.givenName} ${name.familyName}`,
          email: emails[0].value,
          age: 18, 
          password: "123", 
          confirmPassword: "123",
          whatsapp: 0, 
          roles: [2], 
        });
      }

     
      done(null, player);
    } catch (error) {
      
      done(new InternalServerErrorException('An error occurred during Google OAuth validation'), false);
    }
  }
}
