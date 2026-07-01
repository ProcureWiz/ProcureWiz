# ADR-006: Defer CQRS Adoption

## Status
Accepted

## Date
2026-07-01

## Context
CQRS can improve scaling in high-throughput domains but introduces substantial complexity in smaller systems.

## Decision
Use modular layered architecture for now and defer CQRS until demand justifies selective adoption.

## Consequences
- Faster development and easier onboarding at current scale.
- Lower operational complexity during early milestones.
- Revisit when command/read throughput warrants architectural split.
