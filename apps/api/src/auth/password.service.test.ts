import assert from 'node:assert/strict';
import test from 'node:test';
import { AuthConfigService } from './auth-config.service.js';
import { PasswordService } from './password.service.js';

const authConfigStub = {
  argon2: {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
    hashLength: 32,
  },
} as AuthConfigService;

test('same password hashes differently each time', async () => {
  const service = new PasswordService(authConfigStub);

  const one = await service.hash('CorrectHorseBatteryStaple!');
  const two = await service.hash('CorrectHorseBatteryStaple!');

  assert.notEqual(one, two);
});

test('verify succeeds with correct password', async () => {
  const service = new PasswordService(authConfigStub);
  const password = 'ProcureWizStrongPass123!';
  const hash = await service.hash(password);

  const ok = await service.verify(password, hash);

  assert.equal(ok, true);
});

test('verify fails with incorrect password', async () => {
  const service = new PasswordService(authConfigStub);
  const hash = await service.hash('CorrectPassword123!');

  const ok = await service.verify('WrongPassword123!', hash);

  assert.equal(ok, false);
});

test('empty input is rejected', async () => {
  const service = new PasswordService(authConfigStub);

  await assert.rejects(async () => service.hash(''), {
    message: 'password must not be empty',
  });

  const hash = await service.hash('AnyPassword123!');
  await assert.rejects(async () => service.verify('', hash), {
    message: 'password must not be empty',
  });

  await assert.rejects(async () => service.verify('AnyPassword123!', ''), {
    message: 'hash must not be empty',
  });
});

test('long passwords are handled correctly', async () => {
  const service = new PasswordService(authConfigStub);
  const longPassword = 'p'.repeat(1024);

  const hash = await service.hash(longPassword);
  const ok = await service.verify(longPassword, hash);

  assert.equal(ok, true);
});

test('needsRehash returns false for current parameters', async () => {
  const service = new PasswordService(authConfigStub);
  const hash = await service.hash('PasswordForRehashCheck123!');

  const needsRehash = service.needsRehash(hash);

  assert.equal(needsRehash, false);
});
