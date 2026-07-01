import { type AccessRequirement, type AuthorizationDecision, type RbacIdentity, type RbacServiceContract } from './rbac.service.contract.js';
import { type RbacRole } from './rbac-role.enum.js';

export class RbacService implements RbacServiceContract {
  hasRole(identity: RbacIdentity, role: RbacRole): boolean {
    return identity.roles.includes(role);
  }

  hasAnyRole(identity: RbacIdentity, roles: RbacRole[]): boolean {
    if (roles.length === 0) {
      return true;
    }

    return roles.some((role) => this.hasRole(identity, role));
  }

  hasAllRoles(identity: RbacIdentity, roles: RbacRole[]): boolean {
    return roles.every((role) => this.hasRole(identity, role));
  }

  authorize(identity: RbacIdentity, requirement: AccessRequirement): AuthorizationDecision {
    const missingRoles = new Set<RbacRole>();

    if (requirement.allOf && requirement.allOf.length > 0) {
      for (const role of requirement.allOf) {
        if (!this.hasRole(identity, role)) {
          missingRoles.add(role);
        }
      }
    }

    if (requirement.anyOf && requirement.anyOf.length > 0) {
      const hasAny = this.hasAnyRole(identity, requirement.anyOf);
      if (!hasAny) {
        for (const role of requirement.anyOf) {
          missingRoles.add(role);
        }
      }
    }

    return {
      allowed: missingRoles.size === 0,
      missingRoles: [...missingRoles],
    };
  }
}
