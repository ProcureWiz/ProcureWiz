# ADR-001: Monorepo Structure

## Status
Accepted

## Date
2026-07-01

## Context
ProcureWiz includes multiple deliverables that evolve together: API, dashboard, browser extension, and shared packages. Splitting these into separate repositories would increase coordination overhead and version drift risk.

## Decision
Use a single pnpm monorepo with application code in apps and shared modules in packages.

## Consequences
- Enables shared tooling and dependency management.
- Simplifies cross-package refactors and integration testing.
- Requires stronger workspace discipline for lockfiles and scripts.
