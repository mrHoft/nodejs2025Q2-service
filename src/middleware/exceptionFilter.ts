import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { FileLogging } from 'src/utils/logs';
import { getFormattedTimestamp } from 'src/utils/timestamp';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new FileLogging()
  private colors = {
    error: '\x1b[31m',  // Red for errors
    reset: '\x1b[0m'    // Reset colors
  };

  public logError(error: Error) {
    const timestamp = getFormattedTimestamp();
    const errorMessage = error.stack || error.message;
    const logMessage = `[${timestamp}] ERROR: ${errorMessage}\n`;

    console.error(`${this.colors.error}${logMessage}${this.colors.reset}`);

    this.logger.logError(logMessage);
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
