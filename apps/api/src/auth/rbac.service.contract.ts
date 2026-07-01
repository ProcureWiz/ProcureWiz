import { type RbacRole } from './rbac-role.enum.js';

export type RbacIdentity = {
  userId: string;
  organizationId?: string;
  roles: RbacRole[];
};

export type AccessRequirement = {
  anyOf?: RbacRole[];
  allOf?: RbacRole[];
};

export type AuthorizationDecision = {
  allowed: boolean;
  missingRoles: RbacRole[];
};

export interface RbacServiceContract {
  hasRole(identity: RbacIdentity, role: RbacRole): boolean;
  hasAnyRole(identity: RbacIdentity, roles: RbacRole[]): boolean;
  hasAllRoles(identity: RbacIdentity, roles: RbacRole[]): boolean;
  authorize(identity: RbacIdentity, requirement: AccessRequirement): AuthorizationDecision;
}
