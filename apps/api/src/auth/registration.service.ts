import { AuthConfigService } from './auth-config.service.js';
import { type JwtServiceContract } from './jwt.service.contract.js';
import { type PasswordServiceContract } from './password.service.contract.js';
import {
  type RegisterLocalAccountInput,
  type RegisterLocalAccountResult,
  type RegistrationServiceContract,
} from './registration.service.contract.js';
import { type RegistrationStoreContract } from './registration-store.contract.js';

const DEFAULT_ROLE = 'owner';

export class RegistrationService implements RegistrationServiceContract {
  constructor(
    private readonly authConfigService: AuthConfigService,
    private readonly passwordService: PasswordServiceContract,
    private readonly jwtService: JwtServiceContract,
    private readonly registrationStore: RegistrationStoreContract,
  ) {}

  async registerLocalAccount(input: RegisterLocalAccountInput): Promise<RegisterLocalAccountResult> {
    const email = this.normalizeEmail(input.email);
    this.assertNonEmpty('password', input.password);

    const existingIdentity = await this.registrationStore.findIdentityByEmail(email);
    if (existingIdentity) {
      throw new Error('IDENTITY_ALREADY_EXISTS');
    }

    const organizationName = this.resolveOrganizationName(input, email);
    const organization = await this.registrationStore.createOrganization(organizationName);

    const passwordHash = await this.passwordService.hash(input.password);

    const identity = await this.registrationStore.createIdentity({
      email,
      passwordHash,
      organizationId: organization.id,
      roles: [DEFAULT_ROLE],
      displayName: input.displayName,
    });

    const accessToken = await this.jwtService.signAccessToken({
      subject: identity.id,
      roles: identity.roles,
      organizationId: organization.id,
    });
    const refreshToken = await this.jwtService.signRefreshToken({
      subject: identity.id,
      roles: identity.roles,
      organizationId: organization.id,
    });

    return {
      identityId: identity.id,
      organizationId: organization.id,
      roles: identity.roles,
      accessToken,
      refreshToken,
      refreshTokenId: refreshToken.tokenId,
      tokenIssuer: this.authConfigService.jwtIssuer,
    };
  }

  private resolveOrganizationName(input: RegisterLocalAccountInput, email: string): string {
    if (input.organizationName && input.organizationName.trim().length > 0) {
      return input.organizationName.trim();
    }

    const localPart = email.split('@')[0] ?? 'organization';
    return `${localPart} organization`;
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
