import assert from 'node:assert/strict';
import test from 'node:test';
import { AuthConfigService } from './auth-config.service.js';
import { type JwtServiceContract, type SignedJwtToken } from './jwt.service.contract.js';
import { type PasswordServiceContract } from './password.service.contract.js';
import { RegistrationService } from './registration.service.js';
import { type RegistrationStoreContract } from './registration-store.contract.js';

class PasswordServiceFake implements PasswordServiceContract {
  hashCalls: string[] = [];

  async hash(password: string): Promise<string> {
    this.hashCalls.push(password);
    return `hashed:${password}`;
  }

  async verify(): Promise<boolean> {
    return true;
  }

  needsRehash(): boolean {
    return false;
  }
}

class JwtServiceFake implements JwtServiceContract {
  async signAccessToken(identity: { subject: string; roles?: string[]; organizationId?: string }): Promise<SignedJwtToken> {
    return {
      token: `access-${identity.subject}`,
      tokenId: `access-id-${identity.subject}`,
      kind: 'access',
      expiresInSeconds: 900,
    };
  }

  async signRefreshToken(identity: { subject: string; roles?: string[]; organizationId?: string }): Promise<SignedJwtToken> {
    return {
      token: `refresh-${identity.subject}`,
      tokenId: `refresh-id-${identity.subject}`,
      kind: 'refresh',
      expiresInSeconds: 2592000,
    };
  }

  async verifyAccessToken(): Promise<never> {
    throw new Error('NOT_REQUIRED_IN_REGISTRATION_TEST');
  }

  async verifyRefreshToken(): Promise<never> {
    throw new Error('NOT_REQUIRED_IN_REGISTRATION_TEST');
  }

  async rotateRefreshToken(): Promise<never> {
    throw new Error('NOT_REQUIRED_IN_REGISTRATION_TEST');
  }
}

class RegistrationStoreFake implements RegistrationStoreContract {
  private readonly identities = new Map<string, { id: string; email: string; organizationId: string; roles: string[] }>();

  organizationCreateCalls = 0;
  identityCreateCalls = 0;
  latestCreateIdentityInput:
    | {
        email: string;
        passwordHash: string;
        organizationId: string;
        roles: string[];
        displayName?: string;
      }
    | undefined;

  async findIdentityByEmail(email: string) {
    return this.identities.get(email) ?? null;
  }

  async createOrganization(name: string) {
    this.organizationCreateCalls += 1;
    return {
      id: `org-${this.organizationCreateCalls}`,
      name,
    };
  }

  async createIdentity(input: {
    email: string;
    passwordHash: string;
    organizationId: string;
    roles: string[];
    displayName?: string;
  }) {
    this.identityCreateCalls += 1;
    this.latestCreateIdentityInput = input;

    const identity = {
      id: `identity-${this.identityCreateCalls}`,
      email: input.email,
      organizationId: input.organizationId,
      roles: input.roles,
    };

    this.identities.set(input.email, identity);
    return identity;
  }

  seedIdentity(email: string): void {
    this.identities.set(email, {
      id: 'identity-seeded',
      email,
      organizationId: 'org-seeded',
      roles: ['owner'],
    });
  }
}

const authConfigStub = {
  jwtIssuer: 'procurewiz-api',
} as AuthConfigService;

test('registers local account and returns tokens', async () => {
  const passwordService = new PasswordServiceFake();
  const jwtService = new JwtServiceFake();
  const store = new RegistrationStoreFake();
  const service = new RegistrationService(authConfigStub, passwordService, jwtService, store);

  const result = await service.registerLocalAccount({
    email: '  User@Example.com ',
    password: 'StrongPassword123!',
    displayName: 'User One',
    organizationName: 'ProcureWiz Org',
  });

  assert.equal(result.identityId, 'identity-1');
  assert.equal(result.organizationId, 'org-1');
  assert.equal(result.accessToken.kind, 'access');
  assert.equal(result.refreshToken.kind, 'refresh');
  assert.equal(result.refreshTokenId, 'refresh-id-identity-1');
  assert.equal(result.tokenIssuer, 'procurewiz-api');

  assert.equal(passwordService.hashCalls.length, 1);
  assert.equal(store.organizationCreateCalls, 1);
  assert.equal(store.identityCreateCalls, 1);
  assert.equal(store.latestCreateIdentityInput?.email, 'user@example.com');
  assert.equal(store.latestCreateIdentityInput?.passwordHash, 'hashed:StrongPassword123!');
  assert.deepEqual(store.latestCreateIdentityInput?.roles, ['owner']);
});

test('registration fails when identity already exists', async () => {
  const passwordService = new PasswordServiceFake();
  const jwtService = new JwtServiceFake();
  const store = new RegistrationStoreFake();
  store.seedIdentity('existing@example.com');

  const service = new RegistrationService(authConfigStub, passwordService, jwtService, store);

  await assert.rejects(
    async () =>
      service.registerLocalAccount({
        email: 'existing@example.com',
        password: 'StrongPassword123!',
      }),
    {
      message: 'IDENTITY_ALREADY_EXISTS',
    },
  );

  assert.equal(store.organizationCreateCalls, 0);
  assert.equal(store.identityCreateCalls, 0);
  assert.equal(passwordService.hashCalls.length, 0);
});

test('registration rejects empty password', async () => {
  const passwordService = new PasswordServiceFake();
  const jwtService = new JwtServiceFake();
  const store = new RegistrationStoreFake();

  const service = new RegistrationService(authConfigStub, passwordService, jwtService, store);

  await assert.rejects(
    async () =>
      service.registerLocalAccount({
        email: 'new@example.com',
        password: '   ',
      }),
    {
      message: 'password must not be empty',
    },
  );
});
