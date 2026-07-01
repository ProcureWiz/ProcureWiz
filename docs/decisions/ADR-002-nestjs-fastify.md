# ADR-002: NestJS with Fastify for API

## Status
Accepted

## Date
2026-07-01

## Context
The API needs a maintainable framework with modular architecture, validation support, and scalable structure. Runtime efficiency and low overhead are important for future growth.

## Decision
Use NestJS as the API framework with Fastify as the HTTP platform adapter.

## Consequences
- Strong module and dependency-injection patterns for maintainability.
- Improved throughput characteristics versus a default Express baseline.
- Team must follow NestJS conventions and lifecycle patterns.
