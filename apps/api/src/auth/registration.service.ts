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
    private readonly passwordService: PasswordServiceContract,
    private readonly registrationStore: RegistrationStoreContract,
  ) {}

  async registerLocalAccount(input: RegisterLocalAccountInput): Promise<RegisterLocalAccountResult> {
    const email = this.normalizeEmail(input.email);
    this.assertNonEmpty('password', input.password);

    const userExists = await this.registrationStore.userExists(email);
    if (userExists) {
      throw new Error('IDENTITY_ALREADY_EXISTS');
    }

    const organizationName = this.resolveOrganizationName(input, email);
    const organizationExists = await this.registrationStore.organizationExists(organizationName);
    if (organizationExists) {
      throw new Error('ORGANIZATION_ALREADY_EXISTS');
    }

    const organization = await this.registrationStore.createOrganization(organizationName);

    const passwordHash = await this.passwordService.hash(input.password);

    const identity = await this.registrationStore.createUser({
      email,
      passwordHash,
      organizationId: organization.id,
      roles: [DEFAULT_ROLE],
      displayName: input.displayName,
    });

    return {
      identityId: identity.id,
      organizationId: organization.id,
      roles: identity.roles,
      registeredAt: new Date().toISOString(),
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
