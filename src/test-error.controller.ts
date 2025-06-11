import { Controller, Get } from '@nestjs/common';

@Controller('test-errors')
export class TestErrorController {
  @Get('uncaught')
  triggerUncaughtException() {
    setTimeout(() => {
      throw new Error('This is an uncaught exception!');
    }, 100);
    return { message: 'Uncaught exception will be thrown shortly' };
  }

  @Get('unhandled')
  triggerUnhandledRejection() {
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('This is an unhandled rejection!'));
      }, 100);
    });
    return { message: 'Unhandled rejection will occur shortly' };
  }
}
