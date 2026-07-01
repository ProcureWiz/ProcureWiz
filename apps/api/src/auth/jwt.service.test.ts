import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';
import { AuthConfigService } from './auth-config.service.js';
import { JwtService } from './jwt.service.js';

const configStub = {
  jwt: (kind: 'access' | 'refresh') => {
    if (kind === 'access') {
      return {
        issuer: 'procurewiz-test',
        audience: 'procurewiz-test-clients',
        secret: 'access-secret-should-be-at-least-thirty-two-chars',
        ttlSeconds: 60,
      };
    }

    return {
      issuer: 'procurewiz-test',
      audience: 'procurewiz-test-clients',
      secret: 'refresh-secret-should-be-at-least-thirty-two-chars',
      ttlSeconds: 120,
    };
  },
} as AuthConfigService;

test('sign and verify access token', async () => {
  const service = new JwtService(configStub);

  const signed = await service.signAccessToken({
    subject: 'user-1',
    roles: ['admin'],
    organizationId: 'org-1',
  });

  const verified = await service.verifyAccessToken(signed.token);

  assert.equal(verified.subject, 'user-1');
  assert.equal(verified.kind, 'access');
  assert.equal(verified.tokenId, signed.tokenId);
  assert.deepEqual(verified.roles, ['admin']);
  assert.equal(verified.organizationId, 'org-1');
});

test('verify fails for expired token', async () => {
  const service = new JwtService(configStub);
  const expired = jwt.sign(
    {
      sub: 'user-2',
      jti: 'expired-token-id',
      typ: 'access',
      roles: ['user'],
    },
    configStub.jwt('access').secret,
    {
      issuer: configStub.jwt('access').issuer,
      audience: configStub.jwt('access').audience,
      expiresIn: -10,
    },
  );

  await assert.rejects(async () => service.verifyAccessToken(expired), {
    message: 'TOKEN_EXPIRED',
  });
});

test('verify fails for invalid token', async () => {
  const service = new JwtService(configStub);

  await assert.rejects(async () => service.verifyAccessToken('not-a-token'), {
    message: 'TOKEN_INVALID',
  });
});

test('refresh token rotation returns replacement and invalidates previous token id', async () => {
  const service = new JwtService(configStub);
  const current = await service.signRefreshToken({
    subject: 'user-3',
    roles: ['buyer'],
    organizationId: 'org-2',
  });

  const rotated = await service.rotateRefreshToken(current.token);
  const verifiedReplacement = await service.verifyRefreshToken(rotated.replacementRefreshToken.token);

  assert.equal(rotated.invalidatedTokenId, current.tokenId);
  assert.notEqual(rotated.replacementRefreshToken.tokenId, current.tokenId);
  assert.equal(verifiedReplacement.subject, 'user-3');
  assert.equal(verifiedReplacement.kind, 'refresh');
});

test('sign and verify refresh token', async () => {
  const service = new JwtService(configStub);
  const signed = await service.signRefreshToken({ subject: 'user-4' });

  const verified = await service.verifyRefreshToken(signed.token);

  assert.equal(verified.subject, 'user-4');
  assert.equal(verified.kind, 'refresh');
  assert.equal(verified.tokenId, signed.tokenId);
});
