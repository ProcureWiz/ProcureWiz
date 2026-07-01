# Changelog

All notable changes to this repository are documented here.

## v0.0.3 - 2026-07-01

### Added
- Completed Milestone 1.3 platform audit and governance lock-in.
- Added strict milestone sequencing governance and Rule #9 (No Checklist Coding).
- Added ADR-010 for Fastify-only API rate limiting strategy.

### Verified
- Platform kernel audit passed with no duplicate scaffolding required.
- Repository build baseline remained green.

## v0.0.2 - 2026-07-01

### Added
- Established monorepo baseline for API, dashboard, extension, and shared packages.
- Added initial CI, process docs, and ADR foundation.

### Verified
- Baseline build passed.

## Unreleased

### Added
- Milestone 1.4 Component 1: authentication configuration layer (JWT/Argon2 env contract and AuthConfigService).
- Milestone 1.4 Component 2: PasswordService contract and Argon2id implementation.
- Unit tests for password hashing and verification behavior.
- ADR-011 for password hashing strategy (Argon2id).
- Rule #10 (Service Before Endpoint) and milestone report template.
