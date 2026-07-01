import { type SignedJwtToken } from './jwt.service.contract.js';

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
  accessToken: SignedJwtToken;
  refreshToken: SignedJwtToken;
  refreshTokenId: string;
  tokenIssuer: string;
};

export interface RegistrationServiceContract {
  registerLocalAccount(input: RegisterLocalAccountInput): Promise<RegisterLocalAccountResult>;
}
