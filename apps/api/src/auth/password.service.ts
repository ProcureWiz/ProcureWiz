import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';
import { AuthConfigService } from './auth-config.service.js';
import { type PasswordServiceContract } from './password.service.contract.js';

@Injectable()
export class PasswordService implements PasswordServiceContract {
  constructor(private readonly authConfigService: AuthConfigService) {}

  async hash(password: string): Promise<string> {
    this.assertNonEmpty('password', password);

    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: this.authConfigService.argon2.memoryCost,
      timeCost: this.authConfigService.argon2.timeCost,
      parallelism: this.authConfigService.argon2.parallelism,
      hashLength: this.authConfigService.argon2.hashLength,
    });
  }

  async verify(password: string, hash: string): Promise<boolean> {
    this.assertNonEmpty('password', password);
    this.assertNonEmpty('hash', hash);

    return argon2.verify(hash, password);
  }

  needsRehash(hash: string): boolean {
    this.assertNonEmpty('hash', hash);

    return argon2.needsRehash(hash, {
      memoryCost: this.authConfigService.argon2.memoryCost,
      timeCost: this.authConfigService.argon2.timeCost,
      parallelism: this.authConfigService.argon2.parallelism,
    });
  }

  private assertNonEmpty(field: string, value: string): void {
    if (value.length === 0) {
      throw new Error(`${field} must not be empty`);
    }
  }
}
