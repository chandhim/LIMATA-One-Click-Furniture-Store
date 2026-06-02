# Post-merge Checklist — LIMATA One-Click Furniture Store

This file lists required steps and quick commands other developers should run after pulling the branch that adds the Product module and Landing Page features.

## Purpose
- Ensure local dev environments are in sync
- Generate Prisma client and apply any migrations
- Seed a local dev database with example products
- Install optional AI service Python deps (if used locally)

## Quick Commands

1. Pull and install workspace dependencies

```bash
git pull origin main
pnpm install
```

2. Create or update your local `.env` (do NOT commit secrets)

- Ensure `DATABASE_URL` / `DIRECT_URL` point to a reachable dev/postgres instance.
- If you don't have a dev DB, run a local Postgres (docker or native) and update `.env` accordingly.

3. Generate Prisma client

```bash
cd apps/api
pnpm exec prisma generate
```

4. Run migrations (only if your team commits migration files or you want to create them locally)

```bash
# If you want to generate and apply a local migration (dev DB reachable):
pnpm exec prisma migrate dev --name product_module

# To deploy existing migrations (CI/staging/prod):
pnpm exec prisma migrate deploy
```

5. Seed the local DB (recommended)

```bash
# From repo root
node prisma/seed.js
```

6. Install ai-service Python deps (if you run the ai-service locally)

```bash
# Use your preferred Python venv
python -m pip install -r apps/ai-service/requirements.txt
```

7. Start dev servers

```bash
pnpm dev
# or start individually
cd apps/api && pnpm dev
cd apps/web && pnpm dev
```

8. Verify basic endpoints

```bash
curl http://127.0.0.1:4000/api/v1/health
curl http://127.0.0.1:4000/api/products
open http://localhost:3000/
```

## Common Issues & Quick Fixes

- Port conflicts: kill the process using the port or let Next pick a different port.
- Prisma P1001 (can't reach DB): confirm `DATABASE_URL`/`DIRECT_URL`, test connectivity with `psql`, check SSL/pgbouncer flags (Supabase pooler may require `?pgbouncer=true`).
- Missing Prisma client: run `pnpm exec prisma generate` in `apps/api`.
- Next.js image host error: local images were added under `apps/web/public/images`; ensure they exist.
- `ts-node` missing for TypeScript seeds: a JS seed `prisma/seed.js` is provided — run it with `node`.

## PR Checklist (suggested for feature PRs)

- Pull latest `main` and rebase your branch.
- Run `pnpm install` and `pnpm exec prisma generate`.
- If your change includes schema updates, either add migration files or document why migrations are not included.
- Run `node prisma/seed.js` (optional) and smoke-test `GET /api/products` and the web product pages.
- Confirm no Next.js external image host errors locally.
- Add short description of DB changes and any environment variables added/changed.

## Notes for CI / Automation

- CI should run: `pnpm install`, `pnpm exec prisma validate`, `pnpm exec prisma generate`, and integration smoke-tests against a test DB.
- If your CI environment uses a DB pooler (pgbouncer), ensure the `DATABASE_URL` and environment match the pooler requirements.

---
If you want, I can also add a PR template (`.github/PULL_REQUEST_TEMPLATE.md`) and a small CI job snippet that runs the above validations.
