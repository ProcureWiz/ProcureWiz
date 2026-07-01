export type JwtTokenKind = 'access' | 'refresh';

export type JwtIdentity = {
  subject: string;
  roles?: string[];
  organizationId?: string;
};

export type SignedJwtToken = {
  token: string;
  tokenId: string;
  kind: JwtTokenKind;
  expiresInSeconds: number;
};

export type VerifiedJwtToken = {
  subject: string;
  tokenId: string;
  kind: JwtTokenKind;
  roles: string[];
  organizationId?: string;
  issuedAt: number;
  expiresAt: number;
};

export type RefreshRotationResult = {
  replacementRefreshToken: SignedJwtToken;
  invalidatedTokenId: string;
};

export interface JwtServiceContract {
  signAccessToken(identity: JwtIdentity): Promise<SignedJwtToken>;
  signRefreshToken(identity: JwtIdentity): Promise<SignedJwtToken>;
  verifyAccessToken(token: string): Promise<VerifiedJwtToken>;
  verifyRefreshToken(token: string): Promise<VerifiedJwtToken>;
  rotateRefreshToken(currentRefreshToken: string): Promise<RefreshRotationResult>;
}
