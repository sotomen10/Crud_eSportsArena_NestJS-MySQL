import { login } from '../dto/login-auth.dto';
import { Players } from '../../modules/players/entities/player.entity'; 
import { CreatePlayerDto } from '../../modules/players/dto/create-player.dto'; 

export interface AuthInterface {
    signIn(data: login): Promise<{ alldata: Players; accessToken: string }>;
    register(data: CreatePlayerDto): Promise<Players>; 
}
