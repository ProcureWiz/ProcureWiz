import { type SignedJwtToken } from './jwt.service.contract.js';

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthenticatedIdentity = {
  id: string;
  email: string;
  organizationId: string;
  roles: string[];
};

export type LoginResult = {
  identity: AuthenticatedIdentity;
  accessToken: SignedJwtToken;
  refreshToken: SignedJwtToken;
  accessTokenExpiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
};

export interface LoginServiceContract {
  login(input: LoginInput): Promise<LoginResult>;
}
