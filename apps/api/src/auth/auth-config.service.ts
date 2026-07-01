import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type JwtTokenKind = 'access' | 'refresh';

export type JwtSigningConfig = {
  issuer: string;
  audience: string;
  secret: string;
  ttlSeconds: number;
};

export type Argon2Config = {
  memoryCost: number;
  timeCost: number;
  parallelism: number;
  hashLength: number;
};

@Injectable()
export class AuthConfigService {
  constructor(private readonly configService: ConfigService) {}

  get jwtIssuer(): string {
    return this.configService.get<string>('JWT_ISSUER', 'procurewiz-api');
  }

  get jwtAudience(): string {
    return this.configService.get<string>('JWT_AUDIENCE', 'procurewiz-clients');
  }

  get accessTokenSecret(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET');
  }

  get refreshTokenSecret(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  get accessTokenTtlSeconds(): number {
    return this.configService.get<number>('JWT_ACCESS_TOKEN_TTL_SECONDS', 900);
  }

  get refreshTokenTtlSeconds(): number {
    return this.configService.get<number>('JWT_REFRESH_TOKEN_TTL_SECONDS', 2592000);
  }

  get argon2(): Argon2Config {
    return {
      memoryCost: this.configService.get<number>('ARGON2_MEMORY_COST', 19456),
      timeCost: this.configService.get<number>('ARGON2_TIME_COST', 2),
      parallelism: this.configService.get<number>('ARGON2_PARALLELISM', 1),
      hashLength: this.configService.get<number>('ARGON2_HASH_LENGTH', 32),
    };
  }

  jwt(kind: JwtTokenKind): JwtSigningConfig {
    if (kind === 'access') {
      return {
        issuer: this.jwtIssuer,
        audience: this.jwtAudience,
        secret: this.accessTokenSecret,
        ttlSeconds: this.accessTokenTtlSeconds,
      };
    }

    return {
      issuer: this.jwtIssuer,
      audience: this.jwtAudience,
      secret: this.refreshTokenSecret,
      ttlSeconds: this.refreshTokenTtlSeconds,
    };
  }
}
