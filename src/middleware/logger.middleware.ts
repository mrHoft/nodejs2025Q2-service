import { Injectable, NestMiddleware } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { FileLogging } from 'src/utils/logs';
import { getFormattedTimestamp } from 'src/utils/timestamp';

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
  private fileLogger = new FileLogging()
  private colors = {
    GET: '\x1b[32m',     // Green
    POST: '\x1b[34m',    // Blue
    PUT: '\x1b[33m',     // Yellow
    PATCH: '\x1b[35m',   // Magenta
    DELETE: '\x1b[31m',  // Red
    reset: '\x1b[0m'     // Reset colors
  };

  use(req: NestRequest, res: NestResponse, next: () => void) {
    const start = Date.now();
    const { method, originalUrl: url, body } = req;
    const timestamp = getFormattedTimestamp();
    const parsedBody = body ? JSON.stringify(body) : ''

    res.on('close', () => {
      const duration = Date.now() - start;
      const coloredMethod = this.getColoredMethod(method);
      const statusColor = this.getStatusColor(res.statusCode);

      console.log(`[${coloredMethod}] ${url} ${parsedBody} ${statusColor}${res.statusCode}${this.colors.reset} (${duration}ms)`);

      const logEntry = `[${timestamp}] [${method}] ${url} ${parsedBody} ${res.statusCode} (${duration}ms)\n`;
      this.fileLogger.log('info', logEntry);
    });

    next();
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
