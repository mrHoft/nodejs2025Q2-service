import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private colors = {
    error: '\x1b[31m',  // Red for errors
    reset: '\x1b[0m'    // Reset colors
  };

  private logStream = this.initializeLogStream('errors.log');

  private initializeLogStream(filename: string) {
    const logDir = join(process.cwd(), 'logs');
    if (!existsSync(logDir)) {
      mkdirSync(logDir);
    }
    return createWriteStream(join(logDir, filename), { flags: 'a' });
  }

  private getFormattedTimestamp(): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    return `${date} ${time}`;
  }

  public logError(error: Error) {
    const timestamp = this.getFormattedTimestamp();
    const errorMessage = error.stack || error.message;
    const logMessage = `[${timestamp}] ERROR: ${errorMessage}\n`;

    console.error(`${this.colors.error}${logMessage}${this.colors.reset}`);

    this.logStream.write(logMessage);
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.logError(exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
