import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus,HttpException } from '@nestjs/common';
import { FileLogging } from 'src/utils/logs';
import { getFormattedTimestamp } from 'src/utils/timestamp';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private fileLogger = new FileLogging()
  private colors = {
    error: '\x1b[31m',  // Red for errors
    reset: '\x1b[0m'    // Reset colors
  };

  public logError(error: Error) {
    const timestamp = getFormattedTimestamp();
    const errorMessage = error.stack || error.message;
    const logMessage = `[${timestamp}] ${errorMessage}\n`;

    console.error(`${this.colors.error}${logMessage}${this.colors.reset}`);

    this.fileLogger.log('error', logMessage);
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message || HttpStatus[status],
      });
      return;
    }

    this.logError(exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
