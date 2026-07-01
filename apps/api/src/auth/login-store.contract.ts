export type LoginIdentityRecord = {
  id: string;
  email: string;
  passwordHash: string;
  organizationId: string;
  roles: string[];
};

export type RefreshTokenMetadataUpdate = {
  userId: string;
  refreshTokenId: string;
  replacedTokenId?: string;
  expiresAt: string;
};

export interface LoginStoreContract {
  findUserByEmail(email: string): Promise<LoginIdentityRecord | null>;
  updateRefreshTokenMetadata(input: RefreshTokenMetadataUpdate): Promise<void>;
}
