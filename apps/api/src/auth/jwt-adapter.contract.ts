import { type JwtPayload } from './jwt.service.contract.js';

export type JwtSignInput = {
  payload: JwtPayload;
  secret: string;
  issuer: string;
  audience: string;
  expiresInSeconds: number;
};

export type JwtVerifyInput = {
  token: string;
  secret: string;
  issuer: string;
  audience: string;
};

export interface JwtAdapterContract {
  sign(input: JwtSignInput): string;
  verify(input: JwtVerifyInput): JwtPayload;
}
