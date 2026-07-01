# ADR-004: Extension-First Capture Path

## Status
Accepted

## Date
2026-07-01

## Context
A core product capability is supplier capture from external procurement and marketplace sites. Browser context is required to capture user-selected data with minimal friction.

## Decision
Prioritize a browser extension scaffold early, then integrate it with API authentication and ingestion flows in later milestones.

## Consequences
- Unblocks capture UX and site-context experimentation early.
- Introduces manifest, permission, and browser compatibility constraints.
- Requires clear security and auth boundaries between extension and API.
