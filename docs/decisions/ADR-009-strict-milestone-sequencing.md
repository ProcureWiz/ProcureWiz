# ADR-009: Strict Milestone Sequencing Policy

## Status
Accepted

## Date
2026-07-01

## Context
As the platform grows, parallel implementation tracks and unnecessary regeneration increase merge conflicts, token cost, and technical debt risk.

## Decision
Adopt strict milestone sequencing for all future milestones:
- Verify current state before edits.
- Avoid regenerating existing valid scaffolds.
- Implement one component at a time.
- Require compile and build verification after each component.
- Require a component-scoped commit before moving to the next component.
- End each milestone with a clean git status.

## Consequences
- Slower per-component cadence but higher confidence in stability.
- Clearer audit trail and easier rollback at component boundaries.
- Reduced duplicated work and lower maintenance overhead over time.
