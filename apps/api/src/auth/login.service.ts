import { type JwtServiceContract } from './jwt.service.contract.js';
import { type LoginStoreContract } from './login-store.contract.js';
import { type LoginInput, type LoginResult, type LoginServiceContract } from './login.service.contract.js';
import { type PasswordServiceContract } from './password.service.contract.js';

export class LoginService implements LoginServiceContract {
  constructor(
    private readonly passwordService: PasswordServiceContract,
    private readonly jwtService: JwtServiceContract,
    private readonly loginStore: LoginStoreContract,
  ) {}

  async login(input: LoginInput): Promise<LoginResult> {
    const email = this.normalizeEmail(input.email);
    this.assertNonEmpty('password', input.password);

    const identity = await this.loginStore.findIdentityByEmail(email);
    if (!identity) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const passwordOk = await this.passwordService.verify(input.password, identity.passwordHash);
    if (!passwordOk) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const accessToken = await this.jwtService.signAccessToken({
      subject: identity.id,
      roles: identity.roles,
      organizationId: identity.organizationId,
    });

    const refreshToken = await this.jwtService.signRefreshToken({
      subject: identity.id,
      roles: identity.roles,
      organizationId: identity.organizationId,
    });

    return {
      identity: {
        id: identity.id,
        email: identity.email,
        organizationId: identity.organizationId,
        roles: identity.roles,
      },
      accessToken,
      refreshToken,
      accessTokenExpiresInSeconds: accessToken.expiresInSeconds,
      refreshTokenExpiresInSeconds: refreshToken.expiresInSeconds,
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private assertNonEmpty(field: string, value: string): void {
    if (value.trim().length === 0) {
      throw new Error(`${field} must not be empty`);
    }
  }
}
