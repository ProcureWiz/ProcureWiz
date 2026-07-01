# ADR-012: MVP RBAC Model

## Status
Accepted

## Date
2026-07-01

## Context
Milestone 1.4 established the RBAC domain foundation. At this MVP stage, ProcureWiz needs a fixed and explicit authorization model that avoids speculative complexity.

## Decision
ProcureWiz MVP authorization uses fixed roles only.

The MVP role set is:
- PlatformAdmin
- OrganisationAdmin
- ProcurementManager
- Buyer
- Viewer

Role identifiers are contract values across token claims, persisted records, and API/frontend integrations. Renaming or removing any role is a breaking change and requires a migration plan and a follow-up ADR.

The MVP explicitly defers:
- Permissions
- ABAC
- Policy engine
- Multi-role inheritance
- Dynamic authorization

## Consequences
- Authorization remains simple, deterministic, and easy to reason about.
- The current RBAC service stays pure domain logic with no dependency on transport or persistence frameworks.
- Future authorization expansion must be additive and governed through explicit ADRs.
