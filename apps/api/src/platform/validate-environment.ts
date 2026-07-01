type RawConfig = Record<string, unknown>;

const asNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const asString = (value: unknown, fallback: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  return fallback;
};

const requiredString = (value: unknown, key: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw new Error(`Missing required environment variable: ${key}`);
};

const minLengthString = (value: unknown, key: string, minLength: number): string => {
  const normalized = requiredString(value, key);
  if (normalized.length < minLength) {
    throw new Error(`${key} must be at least ${minLength} characters`);
  }

  return normalized;
};

export const validateEnvironment = (config: RawConfig): RawConfig => {
  const validated = { ...config };

  validated.PORT = asNumber(validated.PORT, 3000);
  validated.RATE_LIMIT_MAX = asNumber(validated.RATE_LIMIT_MAX, 100);

  const rawWindow = validated.RATE_LIMIT_TIME_WINDOW;
  validated.RATE_LIMIT_TIME_WINDOW =
    typeof rawWindow === 'string' && rawWindow.trim().length > 0 ? rawWindow : '1 minute';

  const rawCorsOrigin = validated.CORS_ORIGIN;
  validated.CORS_ORIGIN =
    typeof rawCorsOrigin === 'string' && rawCorsOrigin.trim().length > 0 ? rawCorsOrigin : '*';

  validated.JWT_ISSUER = asString(validated.JWT_ISSUER, 'procurewiz-api');
  validated.JWT_AUDIENCE = asString(validated.JWT_AUDIENCE, 'procurewiz-clients');
  validated.JWT_ACCESS_TOKEN_TTL_SECONDS = asNumber(validated.JWT_ACCESS_TOKEN_TTL_SECONDS, 900);
  validated.JWT_REFRESH_TOKEN_TTL_SECONDS = asNumber(validated.JWT_REFRESH_TOKEN_TTL_SECONDS, 2592000);
  validated.JWT_ACCESS_TOKEN_SECRET = minLengthString(
    validated.JWT_ACCESS_TOKEN_SECRET,
    'JWT_ACCESS_TOKEN_SECRET',
    32,
  );
  validated.JWT_REFRESH_TOKEN_SECRET = minLengthString(
    validated.JWT_REFRESH_TOKEN_SECRET,
    'JWT_REFRESH_TOKEN_SECRET',
    32,
  );

  validated.ARGON2_MEMORY_COST = asNumber(validated.ARGON2_MEMORY_COST, 19456);
  validated.ARGON2_TIME_COST = asNumber(validated.ARGON2_TIME_COST, 2);
  validated.ARGON2_PARALLELISM = asNumber(validated.ARGON2_PARALLELISM, 1);
  validated.ARGON2_HASH_LENGTH = asNumber(validated.ARGON2_HASH_LENGTH, 32);

  return validated;
};
