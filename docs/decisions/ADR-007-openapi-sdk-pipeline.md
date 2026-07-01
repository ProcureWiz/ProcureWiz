# ADR-007: OpenAPI-First SDK Pipeline

## Status
Accepted

## Date
2026-07-01

## Context
Handwritten API clients in the dashboard and extension create model drift and runtime integration bugs.

## Decision
Define API contracts in OpenAPI (Swagger) and generate a shared TypeScript SDK consumed by frontend applications.

## Consequences
- API becomes the single source of truth.
- Consumer apps stop maintaining manual request/response clients.
- Milestones must include SDK generation and verification.
