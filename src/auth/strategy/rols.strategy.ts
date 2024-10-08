import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PlayersService } from "../../modules/players/players.service"; 
import { Players } from "../../modules/players/entities/player.entity"; 

@Injectable()
export class JwtStrategyRols extends PassportStrategy(Strategy) {
    constructor(private readonly playersService: PlayersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_APPI,
        });
    }

    async validate(payload: any): Promise<any> {
        console.log('Payload:', payload); 
        const player: Players = await this.playersService.findOne({ id: payload.id });
  
        if (!player) {
            throw new UnauthorizedException('Player not found');
        }
  
        const playerWithRoles = {
            id: player.id,
            email: player.email,
            roles: player.roles.map(role => ({
                id: role.id,
                name: role.name
            })),
        };
  
        console.log('Player in validate:', playerWithRoles); 
  
        return playerWithRoles; 
    }
}
