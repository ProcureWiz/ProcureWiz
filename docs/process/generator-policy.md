# Generator-First Policy

From this point forward, framework scaffolding should prefer official generators whenever possible.

## Preferred Tools
- Nest CLI for NestJS apps
- Vite for React apps
- Prisma CLI for database packages
- Standard package managers for workspace wiring

## Rule
Use generated boilerplate as the starting point, then add ProcureWiz-specific architecture and business logic on top.

## Benefit
This keeps the project aligned with framework best practices and reduces manual boilerplate drift.
