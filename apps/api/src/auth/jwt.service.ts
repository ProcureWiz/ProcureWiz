import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { AuthConfigService } from './auth-config.service.js';
import {
  type JwtIdentity,
  type JwtServiceContract,
  type JwtTokenKind,
  type RefreshRotationResult,
  type SignedJwtToken,
  type VerifiedJwtToken,
} from './jwt.service.contract.js';

type TokenPayload = JwtPayload & {
  sub: string;
  jti: string;
  typ: JwtTokenKind;
  roles?: string[];
  organizationId?: string;
};

@Injectable()
export class JwtService implements JwtServiceContract {
  constructor(private readonly authConfigService: AuthConfigService) {}

  async signAccessToken(identity: JwtIdentity): Promise<SignedJwtToken> {
    return this.signToken('access', identity);
  }

  async signRefreshToken(identity: JwtIdentity): Promise<SignedJwtToken> {
    return this.signToken('refresh', identity);
  }

  async verifyAccessToken(token: string): Promise<VerifiedJwtToken> {
    return this.verifyToken('access', token);
  }

  async verifyRefreshToken(token: string): Promise<VerifiedJwtToken> {
    return this.verifyToken('refresh', token);
  }

  async rotateRefreshToken(currentRefreshToken: string): Promise<RefreshRotationResult> {
    const verified = await this.verifyRefreshToken(currentRefreshToken);
    const replacementRefreshToken = await this.signRefreshToken({
      subject: verified.subject,
      roles: verified.roles,
      organizationId: verified.organizationId,
    });

    return {
      replacementRefreshToken,
      invalidatedTokenId: verified.tokenId,
    };
  }

  private async signToken(kind: JwtTokenKind, identity: JwtIdentity): Promise<SignedJwtToken> {
    this.assertNonEmpty('subject', identity.subject);

    const config = this.authConfigService.jwt(kind);
    const tokenId = randomUUID();

    const payload: TokenPayload = {
      sub: identity.subject,
      jti: tokenId,
      typ: kind,
      roles: identity.roles ?? [],
      organizationId: identity.organizationId,
    };

    const signOptions: SignOptions = {
      issuer: config.issuer,
      audience: config.audience,
      expiresIn: config.ttlSeconds,
    };

    const token = jwt.sign(payload, config.secret, signOptions);

    return {
      token,
      tokenId,
      kind,
      expiresInSeconds: config.ttlSeconds,
    };
  }

  private async verifyToken(kind: JwtTokenKind, token: string): Promise<VerifiedJwtToken> {
    this.assertNonEmpty('token', token);

    const config = this.authConfigService.jwt(kind);

    try {
      const decoded = jwt.verify(token, config.secret, {
        issuer: config.issuer,
        audience: config.audience,
      }) as TokenPayload;

      if (decoded.typ !== kind) {
        throw new Error('TOKEN_INVALID_KIND');
      }

      if (!decoded.sub || !decoded.jti || !decoded.exp || !decoded.iat) {
        throw new Error('TOKEN_INVALID');
      }

      return {
        subject: decoded.sub,
        tokenId: decoded.jti,
        kind,
        roles: decoded.roles ?? [],
        organizationId: decoded.organizationId,
        issuedAt: decoded.iat,
        expiresAt: decoded.exp,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new Error('TOKEN_EXPIRED');
      }

      if (
        error instanceof Error &&
        (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError')
      ) {
        throw new Error('TOKEN_INVALID');
      }

      throw error;
    }
  }

  private assertNonEmpty(field: string, value: string): void {
    if (value.length === 0) {
      throw new Error(`${field} must not be empty`);
    }
  }
}
