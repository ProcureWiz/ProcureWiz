export type RegisterLocalAccountInput = {
  email: string;
  password: string;
  displayName?: string;
  organizationName?: string;
};

export type RegisterLocalAccountResult = {
  identityId: string;
  organizationId: string;
  roles: string[];
  registeredAt: string;
};

export interface RegistrationServiceContract {
  registerLocalAccount(input: RegisterLocalAccountInput): Promise<RegisterLocalAccountResult>;
}
