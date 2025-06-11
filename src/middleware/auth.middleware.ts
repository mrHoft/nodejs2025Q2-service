import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtUtils } from 'src/utils/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No auth header found');
      return this.unauthorized(res, 'Authorization header is missing');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      console.log('Invalid auth scheme');
      return this.unauthorized(res, 'Invalid authorization scheme');
    }

    try {
      const payload = JwtUtils.verify(token, process.env.JWT_SECRET_KEY);
      (req as any).user = payload;
      console.log('Authentication successful for user:', payload.userId);
      next();
    } catch (error) {
      console.log('Token verification failed:', error.message);
      return this.unauthorized(res, 'Invalid or expired token');
    }
  }

  private unauthorized(res: Response, message: string) {
    res.status(401).json({
      statusCode: 401,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
