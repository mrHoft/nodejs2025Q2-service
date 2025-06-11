import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: { login: string; password: string }) {
    if (
      !signupDto.login ||
      !signupDto.password ||
      typeof signupDto.login !== 'string' ||
      typeof signupDto.password !== 'string'
    ) {
      throw new BadRequestException('Invalid credentials');
    }
    const response = await this.authService.signup(signupDto);
    if (response instanceof Error) throw response;

    return response;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { login: string; password: string }) {
    if (
      !loginDto.login ||
      !loginDto.password ||
      typeof loginDto.login !== 'string' ||
      typeof loginDto.password !== 'string'
    ) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body || !body.refreshToken || typeof body.refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token is required');
    }
    const response = await this.authService.refresh(body.refreshToken);
    if (response instanceof Error) throw response;

    return response;
  }
}
