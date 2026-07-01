export type RegistrationOrganization = {
  id: string;
  name: string;
};

export type RegistrationIdentity = {
  id: string;
  email: string;
  organizationId: string;
  roles: string[];
};

export interface RegistrationStoreContract {
  findIdentityByEmail(email: string): Promise<RegistrationIdentity | null>;
  createOrganization(name: string): Promise<RegistrationOrganization>;
  createIdentity(input: {
    email: string;
    passwordHash: string;
    organizationId: string;
    roles: string[];
    displayName?: string;
  }): Promise<RegistrationIdentity>;
}
