import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtUtils, type JwtPayload } from 'src/utils/jwt';
import 'dotenv/config';

const SECRET_KEY = process.env.JWT_SECRET_KEY
const REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY
const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME
const REFRESH_EXPIRE_TIME = process.env.TOKEN_REFRESH_EXPIRE_TIME

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) { }

  async signup(signupDto: { login: string; password: string }) {
    const user = await this.userService.findOneByLogin(signupDto.login);
    if (user) {
      const passwordMatches = await bcrypt.compare(signupDto.password, user.password);
      if (!passwordMatches) {
        return new ForbiddenException('Access Denied');
      }
      return user
    }
    return this.userService.create(signupDto);
  }

  async login(loginDto: { login: string; password: string }): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findOneByLogin(loginDto.login);
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | Error> {
    try {
      const payload = JwtUtils.verify(refreshToken, REFRESH_KEY);
      const user = await this.userService.findOneById(payload.userId);
      if (!user) {
        return new ForbiddenException('Access Denied');
      }
      return this.generateTokens(user);
    } catch (error) {
      return new ForbiddenException('Invalid refresh token');
    }
  }

  private generateTokens(user: any): { accessToken: string; refreshToken: string } {
    const payload: JwtPayload = {
      userId: user.id,
      login: user.login,
    };

    return {
      accessToken: JwtUtils.sign(payload, SECRET_KEY, TOKEN_EXPIRE_TIME),
      refreshToken: JwtUtils.sign(payload, REFRESH_KEY, REFRESH_EXPIRE_TIME),
    };
  }
}
