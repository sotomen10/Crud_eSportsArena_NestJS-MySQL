import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Reflector } from '@nestjs/core';
import { Players } from '../../modules/players/entities/player.entity'; 

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const player: Players = request.user;

    console.log('Player in RolesGuard:', player);

    if (!player) {
      throw new ForbiddenException('Player not found');
    }

    const hasRole = () => player.roles.some(role => role.name === 'Admin'); 
    if (!hasRole()) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
