# ProcureWiz

ProcureWiz is a pnpm monorepo for the API, dashboard, extension, and shared packages.

## Monorepo layout

- `apps/api`: NestJS + Fastify API scaffold
- `apps/dashboard`: React + Vite dashboard scaffold
- `apps/extension`: Manifest V3 browser extension scaffold
- `packages/database`: Prisma schema and migration tooling
- `docs`: governance, process, and architecture decision records

## Quick start

1. Install dependencies:

```bash
npx pnpm@9.15.0 install
```

2. Verify build baseline:

```bash
npx pnpm@9.15.0 build
```

3. Start API development mode:

```bash
npx pnpm@9.15.0 dev:api
```

4. Start dashboard development mode:

```bash
npx pnpm@9.15.0 dev:dashboard
```

## Verification commands

- `npx pnpm@9.15.0 build`: Builds API and dashboard
- `npx pnpm@9.15.0 lint`: Runs Biome lint checks
- `npx pnpm@9.15.0 typecheck`: Runs API TypeScript typecheck

## Documentation

- Process and delivery policy: `docs/process`
- Build and compatibility references: `docs`
- Architecture decision records (ADRs): `docs/decisions`
