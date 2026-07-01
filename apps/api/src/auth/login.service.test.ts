import assert from 'node:assert/strict';
import test from 'node:test';
import { type JwtServiceContract, type SignedJwtToken } from './jwt.service.contract.js';
import { type LoginStoreContract } from './login-store.contract.js';
import { LoginService } from './login.service.js';
import { type PasswordServiceContract } from './password.service.contract.js';

class PasswordServiceFake implements PasswordServiceContract {
  verifyCalls: Array<{ password: string; hash: string }> = [];

  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }

  async verify(password: string, hash: string): Promise<boolean> {
    this.verifyCalls.push({ password, hash });
    return password === 'ValidPassword123!' && hash === 'hashed:ValidPassword123!';
  }

  needsRehash(): boolean {
    return false;
  }
}

class JwtServiceFake implements JwtServiceContract {
  async signAccessToken(identity: { subject: string }): Promise<SignedJwtToken> {
    return {
      token: `access-${identity.subject}`,
      tokenId: `access-id-${identity.subject}`,
      kind: 'access',
      expiresInSeconds: 900,
    };
  }

  async signRefreshToken(identity: { subject: string }): Promise<SignedJwtToken> {
    return {
      token: `refresh-${identity.subject}`,
      tokenId: `refresh-id-${identity.subject}`,
      kind: 'refresh',
      expiresInSeconds: 2592000,
    };
  }

  async verifyAccessToken(): Promise<never> {
    throw new Error('NOT_REQUIRED_IN_LOGIN_TEST');
  }

  async verifyRefreshToken(): Promise<never> {
    throw new Error('NOT_REQUIRED_IN_LOGIN_TEST');
  }

  async rotateRefreshToken(): Promise<never> {
    throw new Error('NOT_REQUIRED_IN_LOGIN_TEST');
  }
}

class LoginStoreFake implements LoginStoreContract {
  private readonly identities = new Map<string, {
    id: string;
    email: string;
    passwordHash: string;
    organizationId: string;
    roles: string[];
  }>();

  refreshMetadataUpdates: Array<{
    userId: string;
    refreshTokenId: string;
    replacedTokenId?: string;
    expiresAt: string;
  }> = [];

  async findUserByEmail(email: string) {
    return this.identities.get(email) ?? null;
  }

  async updateRefreshTokenMetadata(input: {
    userId: string;
    refreshTokenId: string;
    replacedTokenId?: string;
    expiresAt: string;
  }): Promise<void> {
    this.refreshMetadataUpdates.push(input);
  }

  seed(identity: {
    id: string;
    email: string;
    passwordHash: string;
    organizationId: string;
    roles: string[];
  }): void {
    this.identities.set(identity.email, identity);
  }
}

test('login succeeds and returns transport-agnostic auth result', async () => {
  const passwordService = new PasswordServiceFake();
  const jwtService = new JwtServiceFake();
  const store = new LoginStoreFake();
  store.seed({
    id: 'identity-1',
    email: 'user@example.com',
    passwordHash: 'hashed:ValidPassword123!',
    organizationId: 'org-1',
    roles: ['owner'],
  });

  const service = new LoginService(passwordService, jwtService, store);
  const result = await service.login({
    email: ' User@Example.com ',
    password: 'ValidPassword123!',
  });

  assert.equal(result.identity.id, 'identity-1');
  assert.equal(result.identity.email, 'user@example.com');
  assert.equal(result.identity.organizationId, 'org-1');
  assert.deepEqual(result.identity.roles, ['owner']);
  assert.equal(result.accessToken.kind, 'access');
  assert.equal(result.refreshToken.kind, 'refresh');
  assert.equal(result.accessTokenExpiresInSeconds, 900);
  assert.equal(result.refreshTokenExpiresInSeconds, 2592000);
  assert.equal(store.refreshMetadataUpdates.length, 1);
  assert.equal(store.refreshMetadataUpdates[0]?.userId, 'identity-1');
  assert.equal(store.refreshMetadataUpdates[0]?.refreshTokenId, result.refreshToken.tokenId);
});

test('login fails when email does not exist', async () => {
  const passwordService = new PasswordServiceFake();
  const jwtService = new JwtServiceFake();
  const store = new LoginStoreFake();
  const service = new LoginService(passwordService, jwtService, store);

  await assert.rejects(
    async () =>
      service.login({
        email: 'missing@example.com',
        password: 'ValidPassword123!',
      }),
    {
      message: 'INVALID_CREDENTIALS',
    },
  );

  assert.equal(passwordService.verifyCalls.length, 0);
  assert.equal(store.refreshMetadataUpdates.length, 0);
});

test('login fails when password is incorrect', async () => {
  const passwordService = new PasswordServiceFake();
  const jwtService = new JwtServiceFake();
  const store = new LoginStoreFake();
  store.seed({
    id: 'identity-2',
    email: 'user2@example.com',
    passwordHash: 'hashed:ValidPassword123!',
    organizationId: 'org-2',
    roles: ['buyer'],
  });

  const service = new LoginService(passwordService, jwtService, store);

  await assert.rejects(
    async () =>
      service.login({
        email: 'user2@example.com',
        password: 'WrongPassword123!',
      }),
    {
      message: 'INVALID_CREDENTIALS',
    },
  );

  assert.equal(passwordService.verifyCalls.length, 1);
  assert.equal(store.refreshMetadataUpdates.length, 0);
});

test('login rejects empty password', async () => {
  const passwordService = new PasswordServiceFake();
  const jwtService = new JwtServiceFake();
  const store = new LoginStoreFake();
  const service = new LoginService(passwordService, jwtService, store);

  await assert.rejects(
    async () =>
      service.login({
        email: 'user@example.com',
        password: '   ',
      }),
    {
      message: 'password must not be empty',
    },
  );
});
