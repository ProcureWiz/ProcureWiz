# ADR-005: Build Core Platform Before Authentication

## Status
Accepted

## Date
2026-07-01

## Context
Authentication was initially planned as the immediate next milestone. Without shared platform primitives, every future module risks inconsistent configuration, logging, error handling, and validation behavior.

## Decision
Implement a Core Platform milestone first, covering configuration, logging, validation, error handling, security middleware, health checks, and OpenAPI baseline.

## Consequences
- Authentication moves to Milestone 1.4.
- Future modules inherit a consistent runtime contract.
- Initial platform investment reduces long-term technical debt.
