# ADR-011: Password Hashing Strategy

## Status
Accepted

## Date
2026-07-01

## Context
Milestone 1.4 introduces local-account authentication. A stable and modern hashing strategy is required before implementing registration and login flows.

## Decision
ProcureWiz will use Argon2id as the password hashing algorithm for local accounts.

bcrypt will not be introduced unless a verified compatibility requirement requires migration support for an existing user database.

## Consequences
- Improved resistance to GPU-based cracking compared with bcrypt defaults.
- Requires Argon2 runtime dependency and parameter governance.
- Any future fallback or migration path must be documented through a follow-up ADR.
