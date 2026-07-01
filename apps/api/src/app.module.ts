import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller.js';
import { PlatformConfigService } from './platform/platform-config.service.js';
import { PlatformLoggerService } from './platform/platform-logger.service.js';
import { validateEnvironment } from './platform/validate-environment.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate: validateEnvironment,
    }),
  ],
  controllers: [HealthController],
  providers: [PlatformConfigService, PlatformLoggerService],
  exports: [PlatformConfigService, PlatformLoggerService],
})
export class AppModule {}
