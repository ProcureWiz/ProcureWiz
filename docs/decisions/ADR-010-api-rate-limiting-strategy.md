# ADR-010: API Rate Limiting Strategy

## Status
Accepted

## Date
2026-07-01

## Context
The API currently uses Fastify middleware and has rate limiting configured with the Fastify plugin. A decision was needed on whether to introduce `@nestjs/throttler` in parallel.

## Decision
ProcureWiz will use the Fastify rate-limiting plugin as the single implementation for API rate limiting.

`@nestjs/throttler` will not be introduced unless a future verified requirement cannot be met by the Fastify plugin.

## Consequences
- One fewer dependency and simpler maintenance.
- Avoids duplicate throttling mechanisms.
- Keeps configuration aligned with the Fastify runtime stack.
- Future migration to another strategy requires an ADR update and explicit requirement evidence.
