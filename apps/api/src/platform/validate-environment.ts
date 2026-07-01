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

  return validated;
};
