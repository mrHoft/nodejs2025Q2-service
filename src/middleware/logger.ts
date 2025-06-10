import { Injectable, NestMiddleware } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface NestRequest {
  method: string;
  baseUrl: string;
  body: string;
  originalUrl: string
  _parsedUrl: {
    query: string,
    pathname: string,
    path: string,
  }
}

interface NestResponse {
  statusCode: number;
  on(event: string, listener: () => void): void;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private colors = {
    GET: '\x1b[32m',     // Green
    POST: '\x1b[34m',    // Blue
    PUT: '\x1b[33m',     // Yellow
    PATCH: '\x1b[35m',   // Magenta
    DELETE: '\x1b[31m',  // Red
    reset: '\x1b[0m'     // Reset colors
  };

  private logStream = this.initializeLogStream();

  private initializeLogStream() {
    const logDir = join(process.cwd(), 'logs');
    if (!existsSync(logDir)) {
      mkdirSync(logDir);
    }
    const logPath = join(logDir, 'request.log');
    return createWriteStream(logPath, { flags: 'a' });
  }

  use(req: NestRequest, res: NestResponse, next: () => void) {
    const start = Date.now();
    const { method, originalUrl: url, body } = req;
    const timestamp = this.getFormattedTimestamp();
    const parsedBody=body ? JSON.stringify(body) : ''

    res.on('close', () => {
      const duration = Date.now() - start;
      const coloredMethod = this.getColoredMethod(method);
      const statusColor = this.getStatusColor(res.statusCode);

      console.log(`[${coloredMethod}] ${url} ${parsedBody} ${statusColor}${res.statusCode}${this.colors.reset} (${duration}ms)`);

      const logEntry = `[${timestamp}] [${method}] ${url} ${parsedBody} ${res.statusCode} (${duration}ms)\n`;
      this.logStream.write(logEntry);
    });

    next();
  }

  private getFormattedTimestamp(): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].split(':').slice(0, 3).join(':');
    return `${date} ${time}`;
  }

  private getColoredMethod(method: string): string {
    const upperMethod = method.toUpperCase();
    const color = this.colors[upperMethod] || this.colors.reset;
    return `${color}${upperMethod}${this.colors.reset}`;
  }

  private getStatusColor(status: number): string {
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) return '\x1b[31m';
    if (status >= HttpStatus.BAD_REQUEST) return '\x1b[33m';
    return '\x1b[32m';
  }
}
