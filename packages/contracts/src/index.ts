import { z } from 'zod';

export const APP_NAME = 'ProcureWiz';

export const EnvironmentSchema = z.enum(['development', 'staging', 'production']);
export type Environment = z.infer<typeof EnvironmentSchema>;

export const ApiErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
});

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: ApiErrorSchema,
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

export const RequestContextHeadersSchema = z.object({
  'x-request-id': z.string().min(1),
  'x-correlation-id': z.string().min(1),
});

export const HEALTH_ROUTES = {
  base: '/health',
  live: '/health/live',
  ready: '/health/ready',
} as const;
