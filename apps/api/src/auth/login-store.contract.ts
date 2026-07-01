export type LoginIdentityRecord = {
  id: string;
  email: string;
  passwordHash: string;
  organizationId: string;
  roles: string[];
};

export interface LoginStoreContract {
  findIdentityByEmail(email: string): Promise<LoginIdentityRecord | null>;
}
