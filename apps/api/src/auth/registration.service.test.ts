import assert from 'node:assert/strict';
import test from 'node:test';
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

class RegistrationStoreFake implements RegistrationStoreContract {
  private readonly identities = new Map<string, { id: string; email: string; organizationId: string; roles: string[] }>();
  private readonly organizations = new Set<string>();

  organizationCreateCalls = 0;
  userCreateCalls = 0;
  latestCreateUserInput:
    | {
        email: string;
        passwordHash: string;
        organizationId: string;
        roles: string[];
        displayName?: string;
      }
    | undefined;

  async userExists(email: string) {
    return this.identities.has(email);
  }

  async organizationExists(name: string) {
    return this.organizations.has(name.toLowerCase());
  }

  async createOrganization(name: string) {
    this.organizationCreateCalls += 1;
    this.organizations.add(name.toLowerCase());
    return {
      id: `org-${this.organizationCreateCalls}`,
      name,
    };
  }

  async createUser(input: {
    email: string;
    passwordHash: string;
    organizationId: string;
    roles: string[];
    displayName?: string;
  }) {
    this.userCreateCalls += 1;
    this.latestCreateUserInput = input;

    const identity = {
      id: `identity-${this.userCreateCalls}`,
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

  seedOrganization(name: string): void {
    this.organizations.add(name.toLowerCase());
  }
}

test('registers local account and returns registration result', async () => {
  const passwordService = new PasswordServiceFake();
  const store = new RegistrationStoreFake();
  const service = new RegistrationService(passwordService, store);

  const result = await service.registerLocalAccount({
    email: '  User@Example.com ',
    password: 'StrongPassword123!',
    displayName: 'User One',
    organizationName: 'ProcureWiz Org',
  });

  assert.equal(result.identityId, 'identity-1');
  assert.equal(result.organizationId, 'org-1');
  assert.ok(result.registeredAt.length > 0);

  assert.equal(passwordService.hashCalls.length, 1);
  assert.equal(store.organizationCreateCalls, 1);
  assert.equal(store.userCreateCalls, 1);
  assert.equal(store.latestCreateUserInput?.email, 'user@example.com');
  assert.equal(store.latestCreateUserInput?.passwordHash, 'hashed:StrongPassword123!');
  assert.deepEqual(store.latestCreateUserInput?.roles, ['owner']);
});

test('registration fails when identity already exists', async () => {
  const passwordService = new PasswordServiceFake();
  const store = new RegistrationStoreFake();
  store.seedIdentity('existing@example.com');

  const service = new RegistrationService(passwordService, store);

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
  assert.equal(store.userCreateCalls, 0);
  assert.equal(passwordService.hashCalls.length, 0);
});

test('registration fails when organization name already exists', async () => {
  const passwordService = new PasswordServiceFake();
  const store = new RegistrationStoreFake();
  store.seedOrganization('ProcureWiz Org');

  const service = new RegistrationService(passwordService, store);

  await assert.rejects(
    async () =>
      service.registerLocalAccount({
        email: 'new@example.com',
        password: 'StrongPassword123!',
        organizationName: 'ProcureWiz Org',
      }),
    {
      message: 'ORGANIZATION_ALREADY_EXISTS',
    },
  );

  assert.equal(store.organizationCreateCalls, 0);
  assert.equal(store.userCreateCalls, 0);
  assert.equal(passwordService.hashCalls.length, 0);
});

test('registration rejects empty password', async () => {
  const passwordService = new PasswordServiceFake();
  const store = new RegistrationStoreFake();

  const service = new RegistrationService(passwordService, store);

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
