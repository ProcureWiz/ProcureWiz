# Build Verification Checklist

Every milestone must pass the following checks before new functionality is added.

## Repository
- [ ] Repository clones successfully.
- [ ] Dependencies install successfully with pnpm.

## Quality Gates
- [ ] pnpm lint passes.
- [ ] pnpm typecheck passes.
- [ ] pnpm test passes where tests exist.
- [ ] pnpm build passes.

## Runtime Services
- [ ] docker compose up starts all required services.

## CI/CD
- [ ] GitHub Actions passes.

## Rule
If any item fails, stop and fix it before continuing to the next milestone.
