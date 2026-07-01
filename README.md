# ProcureWiz

ProcureWiz is a monorepo for a browser extension, dashboard, backend API, landing site, and shared packages.

## Repository structure

- `apps/api` — backend Node.js API
- `apps/dashboard` — dashboard application
- `apps/extension` — browser extension UI and integration
- `apps/landing` — landing page
- `packages/ui` — shared UI components
- `packages/sdk` — shared SDK logic
- `packages/types` — shared TypeScript types
- `packages/config` — shared configuration utilities

## Getting started

Install dependencies:

```bash
pnpm install
```

Start the backend server:

```bash
pnpm start:api
```

Run the monorepo in development:

```bash
pnpm dev
```

## Environment

Copy `.env.example` to `.env` and update secrets before running the backend.

## Docker

Run the local Compose stack:

```bash
docker-compose up --build
```
