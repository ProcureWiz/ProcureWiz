# ADR-008: Introduce Shared Contracts Package

## Status
Accepted

## Date
2026-07-01

## Context
Shared DTOs, enums, interfaces, and constants were at risk of being duplicated across API, dashboard, and extension.

## Decision
Introduce `@procurewiz/contracts` to hold shared domain contracts and validation schemas.

## Consequences
- Reduces duplicated model definitions.
- Enables type-safe cross-application consistency.
- Requires conscious version governance for shared contract changes.
