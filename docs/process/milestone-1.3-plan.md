# Milestone 1.3 Plan

## Goal
Establish Core Platform services that every future module depends on.

## Deliverables
- Config module
- Request/exception logging baseline
- Global error handling envelope
- Global validation pipeline
- Health endpoints (`/health`, `/health/live`, `/health/ready`)
- Swagger/OpenAPI generation
- Security baseline (Helmet, CORS, rate limiting, compression, request and correlation IDs)
- Generated TypeScript SDK package
- Shared contracts package

## Build Order
Core Platform -> Authentication -> Users -> Organisation -> Supplier Capture

## Architecture Constraints
- Authentication is Milestone 1.4
- No CQRS in current phase
- API is source of truth via OpenAPI

## Verification
- `pnpm openapi:generate`
- `pnpm sdk:generate`
- `pnpm build`
- `pnpm typecheck`
- `git status --short` must be clean at milestone close
