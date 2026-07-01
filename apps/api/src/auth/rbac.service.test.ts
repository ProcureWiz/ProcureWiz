import assert from 'node:assert/strict';
import test from 'node:test';
import { RbacRole } from './rbac-role.enum.js';
import { RbacService } from './rbac.service.js';

const baseIdentity = {
  userId: 'user-1',
  organizationId: 'org-1',
  roles: [RbacRole.Buyer, RbacRole.Viewer],
};

test('hasRole and hasAnyRole evaluate role membership', () => {
  const service = new RbacService();

  assert.equal(service.hasRole(baseIdentity, RbacRole.Buyer), true);
  assert.equal(service.hasRole(baseIdentity, RbacRole.PlatformAdmin), false);

  assert.equal(service.hasAnyRole(baseIdentity, [RbacRole.PlatformAdmin, RbacRole.Buyer]), true);
  assert.equal(service.hasAnyRole(baseIdentity, [RbacRole.PlatformAdmin]), false);
});

test('hasAllRoles requires all requested roles', () => {
  const service = new RbacService();

  assert.equal(service.hasAllRoles(baseIdentity, [RbacRole.Buyer, RbacRole.Viewer]), true);
  assert.equal(service.hasAllRoles(baseIdentity, [RbacRole.Buyer, RbacRole.OrganisationAdmin]), false);
});

test('authorize allows access when anyOf requirement is satisfied', () => {
  const service = new RbacService();

  const decision = service.authorize(baseIdentity, {
    anyOf: [RbacRole.OrganisationAdmin, RbacRole.Buyer],
  });

  assert.equal(decision.allowed, true);
  assert.deepEqual(decision.missingRoles, []);
});

test('authorize returns missing roles when allOf requirement fails', () => {
  const service = new RbacService();

  const decision = service.authorize(baseIdentity, {
    allOf: [RbacRole.Buyer, RbacRole.ProcurementManager],
  });

  assert.equal(decision.allowed, false);
  assert.deepEqual(decision.missingRoles, [RbacRole.ProcurementManager]);
});

test('authorize enforces both anyOf and allOf requirements', () => {
  const service = new RbacService();

  const decision = service.authorize(baseIdentity, {
    anyOf: [RbacRole.PlatformAdmin, RbacRole.OrganisationAdmin],
    allOf: [RbacRole.Buyer],
  });

  assert.equal(decision.allowed, false);
  assert.deepEqual(decision.missingRoles.sort(), [RbacRole.OrganisationAdmin, RbacRole.PlatformAdmin]);
});
