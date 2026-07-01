# ADR-003: Prisma Version Standardization

## Status
Accepted

## Date
2026-07-01

## Context
Prisma packages were introduced in multiple workspaces and began to drift in patch versions, which can create inconsistent generated clients and migration behavior.

## Decision
Standardize Prisma versions across the monorepo by using prisma and @prisma/client version 5.22.0 in all relevant packages.

## Consequences
- Reduces risk of schema and client generation mismatch.
- Simplifies migration and onboarding guidance.
- Requires coordinated upgrades when changing Prisma major or minor versions.
