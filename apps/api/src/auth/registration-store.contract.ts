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
  userExists(email: string): Promise<boolean>;
  organizationExists(name: string): Promise<boolean>;
  createOrganization(name: string): Promise<RegistrationOrganization>;
  createUser(input: {
    email: string;
    passwordHash: string;
    organizationId: string;
    roles: string[];
    displayName?: string;
  }): Promise<RegistrationIdentity>;
}
