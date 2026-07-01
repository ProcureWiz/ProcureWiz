export type JwtTokenKind = 'access' | 'refresh';

export type JwtPayload = {
  sub: string;
  jti: string;
  typ: JwtTokenKind;
  roles?: string[];
  organizationId?: string;
  iat?: number;
  exp?: number;
};

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
  replacementAccessToken: SignedJwtToken;
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
