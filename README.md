# ProcureWiz

ProcureWiz is a monorepo for an AI-enabled procurement toolkit, including:

- `apps/api` — Node.js backend API
- `apps/dashboard` — internal dashboard
- `apps/extension` — browser extension shell
- `apps/landing` — landing page
- `packages/ui` — shared UI components
- `packages/sdk` — shared business logic
- `packages/types` — shared TypeScript types
- `packages/config` — shared configuration utilities

## Getting started

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start the backend:

```bash
pnpm start:api
```

4. Run the monorepo in development mode:

```bash
pnpm dev
```

## Development rules

- No secrets in Git
- No `any` types without a documented exception
- Every endpoint must validate inputs
- Every feature must include tests
- Every merge must pass CI
- Every milestone must build successfully before moving on

## Docker

Build and run the stack:

```bash
docker-compose up --build
```

## Project structure

The repository root contains the monorepo configuration and shared tooling.

The `apps` folder contains all deployable applications, while `packages` contains shared libraries.
