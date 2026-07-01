import { Injectable, Logger } from '@nestjs/common';

type LogLevel = 'log' | 'warn' | 'error';

@Injectable()
export class PlatformLoggerService {
  private readonly logger = new Logger('PlatformLogger');

  logEvent(event: string, payload: Record<string, unknown>, level: LogLevel = 'log'): void {
    const message = JSON.stringify({ event, ...payload });

    if (level === 'error') {
      this.logger.error(message);
      return;
    }

    if (level === 'warn') {
      this.logger.warn(message);
      return;
    }

    this.logger.log(message);
  }
}
