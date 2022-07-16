import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const { email, password } = authDto
    return await this.authService.authUser(email, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto)
  }


}