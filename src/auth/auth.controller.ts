import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { login } from './dto/login-auth.dto';
import { CreatePlayerDto } from '../modules/players/dto/create-player.dto';
import { CreatePlayerPipe } from '../modules/players/pipes/create-player.pipe'; 
import { GoogleAuthGuard } from './guards/jwt-google.guard';
import { Players } from 'src/modules/players/entities/player.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @ApiOperation({ summary: 'Starts Google authentication flow' })
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google authentication callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with access token' })
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res) {
    const user = req.user;
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles.map(role => ({
        id: role.id,
        name: role.name,
      })),
    };
    const accessToken = await this.authService.generateJwtToken(payload);
    res.redirect(`http://localhost:3001/?token=${accessToken}`);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new player' })
  @ApiResponse({ status: 201, description: 'Player registered successfully' })
  @ApiBody({ type: CreatePlayerDto })
  register(@Body(CreatePlayerPipe) createPlayerDto: CreatePlayerDto) {
    return this.authService.register(createPlayerDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'Session started successfully' })
  @ApiBody({ type: login }) 
  async signIn(@Body() login: login): Promise<{ alldata: Players; accessToken: string }> {
    return this.authService.signIn(login);
  }
}
