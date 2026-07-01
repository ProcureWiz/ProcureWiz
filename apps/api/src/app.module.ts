import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthConfigService } from './auth/auth-config.service.js';
import { JwtService } from './auth/jwt.service.js';
import { JsonwebtokenAdapter } from './auth/jsonwebtoken.adapter.js';
import { PasswordService } from './auth/password.service.js';
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
  providers: [
    PlatformConfigService,
    PlatformLoggerService,
    AuthConfigService,
    PasswordService,
    JsonwebtokenAdapter,
    JwtService,
  ],
  exports: [
    PlatformConfigService,
    PlatformLoggerService,
    AuthConfigService,
    PasswordService,
    JsonwebtokenAdapter,
    JwtService,
  ],
})
export class AppModule {}
