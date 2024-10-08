import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Players } from '../../modules/players/entities/player.entity';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activateResult = (await super.canActivate(context)) as boolean;

    if (!activateResult) {
      return false; 
    }

    const request = context.switchToHttp().getRequest();
    const player: Players = request.user;

    if (!player) {
      throw new ForbiddenException('Player not found');
    }

    return true;
  }
}
