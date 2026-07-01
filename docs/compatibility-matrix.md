# Compatibility Matrix

## Runtime
- Node.js: 20.x or 22.x
- pnpm: 9.x
- Docker: 24.x+

## Core Tooling
- TypeScript: 5.7.x
- Biome: 2.x
- Prisma: 5.22.x
- NestJS: 10.4.x
- React: 18.3.x
- Vite: 5.4.x
- Tailwind CSS: 3.4.x

## Approval Rules
Every dependency must be:
- Stable release
- Compatible with the selected Node.js version
- Supported by the surrounding stack

## Update Process
- Update only after checking compatibility
- Keep versions aligned in workspace manifests
- Re-run install, lint, typecheck, test, build, and Docker verification
