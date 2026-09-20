# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

LIMATA is a "one-click" AI-assisted furniture e-commerce platform. It is a pnpm/Turborepo monorepo with three runtime services plus shared packages:

- `apps/web` — Next.js 15 (App Router, React 19) storefront + admin dashboard.
- `apps/api` — Express + TypeScript REST/Socket.IO API, Prisma/PostgreSQL.
- `apps/ai-service` — Python FastAPI microservice for computer-vision/AI (YOLO detection, MiDaS depth, spatial reasoning, Gemini-backed chat/recommendations).
- `packages/types`, `packages/ui`, `packages/config` — shared TS types, UI components, and eslint/prettier/tsconfig presets consumed via `workspace:*`.

The system is three tiers: `web` talks to `api` over HTTP/Socket.IO; `api` talks to `ai-service` over HTTP (see `apps/api/src/lib/ai-client.ts`); `api` is the only service with direct DB access (Prisma against a single shared schema at `prisma/schema.prisma`).

## Commands

Run from the repo root unless noted. Package manager is **pnpm** (`packageManager: pnpm@9.12.0`), orchestrated by **Turborepo**.

```bash
pnpm install                 # install all workspace deps
pnpm dev                     # turbo run dev --parallel (web + api together; ai-service is NOT included, start separately)
pnpm build                   # turbo run build (respects dependency graph via ^build)
pnpm lint                    # turbo run lint
pnpm typecheck                # turbo run typecheck
pnpm format / pnpm format:write   # prettier check/write across repo

# Prisma (schema lives at repo root: prisma/schema.prisma, invoked through apps/api)
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

Per-app (run inside the app directory, or via `pnpm --dir apps/<app> <script>`):

```bash
# apps/web
pnpm --dir apps/web dev          # next dev
pnpm --dir apps/web build        # next build
pnpm --dir apps/web typecheck    # tsc --noEmit

# apps/api
pnpm --dir apps/api dev          # tsx watch src/index.ts
pnpm --dir apps/api build        # prisma generate + tsc + tsc-alias -> dist/
pnpm --dir apps/api start        # node dist/src/index.js
```

API tests use Node's built-in test runner (`node:test`), not Jest — there is no `test` script wired up yet. Run a single file directly, e.g.:

```bash
pnpm --dir apps/api exec tsx --test src/modules/ai/ai.placement.test.ts
```

ai-service (Python, FastAPI) — has its own `.venv`, not part of the pnpm workspace:

```bash
cd apps/ai-service
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000   # dev server (Windows path shown; package.json "dev" script)
pytest                                    # run all tests
pytest tests/ml/test_spatial_unit.py -v   # run a single test file
```

To run the full stack locally you need all three dev servers up (web, api, ai-service) plus a local Postgres matching `DATABASE_URL`.

## Architecture

### apps/api — Express backend

- Entry: `src/index.ts` → `src/server.ts` (HTTP + Socket.IO) → `src/app.ts` (Express app, route mounting, CORS, `/uploads` static).
- **Module-per-domain layout** under `src/modules/<domain>/`: each domain has `*.route.ts` (or `.routes.ts`), `*.controller.ts`, `*.service.ts`, `*.repository.ts` (where DB access is separated from business logic), and `*.validation.ts` (Zod schemas). Domains: `admin`, `ai`, `auth`, `cart`, `chat`, `delivery`, `health`, `notifications`, `orders`, `payments`, `products`, `reviews`, `wishlist`.
- Routes are mounted in `src/app.ts` under `/api/*` prefixes (e.g. `/api/ai`, `/api/products`, `/api/products/:productId/reviews`, `/api/public` for public admin-settings reads).
- `src/lib/ai-client.ts` — axios client to the Python `ai-service`, configurable via `AI_SERVICE_URL`/`AI_SERVICE_HOST`/`AI_SERVICE_PORT`/`AI_SERVICE_TIMEOUT`; strips the `Content-Type` header for `FormData` uploads (image analysis) so axios can set the multipart boundary.
- `src/middleware/`: `authenticate` (required JWT), `optional-authenticate` (JWT if present, else anonymous), `authorize` (role check), `error-handler` (global, mounted last in `app.ts`).
- `src/shared/errors/api-error.ts` + `src/shared/responses/api-response.ts` give a consistent error/response shape across controllers.
- `src/socket/` — Socket.IO server (`socket.server.ts`) and chat namespace (`chat.socket.ts`), for live chat/notifications.
- Path alias `@/*` → `src/*` (see `tsconfig.json`); build emits to `dist/` via `tsc` + `tsc-alias` (alias resolution has to be run as a separate step since `tsc` doesn't rewrite `@/` imports).
- Uses a single Prisma schema shared with `apps/web` (`prisma/schema.prisma` at repo root) — both apps `prisma generate` against the same schema/client.

### apps/web — Next.js frontend

- App Router under `src/app/`. Route groups: `(store)` for customer-facing pages, `admin/` for the admin dashboard (own layout/sidebar), plus top-level routes for cart, checkout, orders, products, auth, profile, notifications, and `shop-this-room` (the AI "visual recommendation" flow — upload a room photo, get furniture matches).
- **Feature-based structure** under `src/features/<feature>/`, each with its own `api/`, `components/`, `hooks/`, `services/`, `types/` as applicable (mirrors the API's module boundaries: `ai`, `auth`, `cart`, `chat`, `notifications`, `orders`, `products`, `wishlist`, plus `admin`/`admin-products` and `home`/`app`).
- State: Zustand stores in `src/store/` (cart, wishlist, UI) and per-feature stores (e.g. `features/auth/store`, `features/app/store`); server state via TanStack Query (`src/providers/react-query-provider.tsx`).
- `src/lib/axios.ts` / `src/lib/api-client.ts` — configured HTTP client(s) to the API, base URL from `NEXT_PUBLIC_API_BASE_URL`; `src/lib/socket.client.ts` — Socket.IO client, paired with `src/providers/socket-provider.tsx`.
- 3D/AR: `@react-three/fiber` + `@react-three/drei` + `three` and `@google/model-viewer` are used for in-browser 3D furniture model viewing (`.glb` models served by the API, optionally optimized via `gltf-pipeline` — see `apps/api/src/modules/products/glb-optimizer.service.ts`).
- `shadcn`-style UI config at `components.json`; shared primitives also come from `packages/ui`.

### apps/ai-service — AI/ML microservice (Python/FastAPI)

Full design reference: `docs/architecture.md`. Key points to know before touching this service:

- **Strict separation**: probabilistic ML inference is isolated from deterministic reasoning. `app/ml/converters.py` is the only place raw YOLO/PyTorch/MiDaS outputs get converted into clean DTOs (`DetectionResult`, `DepthResult`). Everything downstream (`SpatialAnalysisEngine`, `PlacementEvaluationEngine`) operates only on those DTOs — never on framework objects.
- **Coordinate system**: origin top-left, x right, y down, bbox given as `(x1,y1,x2,y2)`. Depth is MiDaS inverse-depth (disparity) — **larger value = closer to camera**.
- Pipeline: `AIOrchestrator` (`app/ml/ai_orchestrator.py`) pulls models from `ModelLoader` (`app/ml/model_loader.py`, lazy-loads + thread-locks), runs YOLO detection + MiDaS depth, converts to DTOs, feeds `SpatialAnalysisEngine` (`app/ml/spatial/`), and optionally `PlacementEvaluationEngine` (`app/ml/placement/`) for furniture-fit checks (congestion index, placement region heuristics).
- `app/ml/registry.py` (`ModelRegistry`) only knows *what* models exist (metadata, weights paths); `ModelLoader` owns actual in-memory lifecycle. **`app/ml/dependencies.py` exposes a single shared `global_loader` — always import and reuse that instance.** Services must not instantiate their own `ModelLoader`; doing so causes YOLO/MiDaS to be loaded into memory once per service (a real issue found and fixed previously, per `docs/testing/final_verification_report.md` — watch for regressions when adding new services under `app/services/`).
- `app/services/` — one file per capability, each a thin layer over the orchestrator/engines: `detection_service.py`, `depth_service.py`, `spatial_service.py`, `placement_service.py`, `recommendation_service.py`, `visual_recommendation_service.py`, `chatbot_service.py`.
- `app/api/routes/` — one router per capability (`detection`, `depth`, `analysis`, `placement`, `recommendation`, `visual_recommendation`, `chatbot`, `health`), aggregated in `app/api/router.py` and mounted in `app/main.py`. Model registration (YOLO/MiDaS metadata) happens on FastAPI `startup` in `app/main.py`.
- `app/core/gemini_client.py` — Google Gemini client for the chatbot/recommendation LLM features (`google-genai` dependency).
- Custom exception hierarchy: `AIException` → `ModelLoadException` / `AIInferenceException` / `UnsupportedModelException`, handled globally via `app/core/exceptions.py`.
- Model weights (`models/yolo`, `models/midas`, `weights/`) are excluded from git; `download_midas.py` fetches MiDaS weights locally.

### Database (Prisma / PostgreSQL)

Single schema at `prisma/schema.prisma`, shared by `apps/api` (and `apps/web` also has its own `prisma:generate`/`prisma:studio` scripts pointing at the same schema). Core models: `User` (role `CUSTOMER`/`ADMIN`), `Product`, `Cart`/`CartItem`, `Wishlist`/`WishlistItem`, `Order`/`OrderItem` + `CheckoutAttempt`/`CheckoutAttemptItem` (tracks abandoned/in-progress checkouts separately from confirmed orders), `Review`, `Category`, `Notification`, `Conversation`/`Message` (human chat), `AiConversation`/`AiMessage` (AI chatbot history, `recommendedProducts` stored as JSON), `DeliveryConfiguration` (per-method threshold-based shipping charge rules), `StoreSetting` (generic key/JSON config store for admin settings).

### Cross-service integration

- Web → API: axios (`apps/web/src/lib/axios.ts`) + Socket.IO client, base URL from `NEXT_PUBLIC_API_BASE_URL`.
- API → AI service: axios (`apps/api/src/lib/ai-client.ts`), base URL from `AI_SERVICE_URL`/`AI_SERVICE_HOST`/`AI_SERVICE_PORT`. The API proxies AI requests (e.g. placement evaluation, visual recommendations) rather than the browser calling `ai-service` directly — see `src/modules/ai/`.
- File storage: local `apps/api/uploads/` in dev, with optional Cloudflare R2 (`R2_*` env vars) / AWS S3 SDK (`@aws-sdk/client-s3`) for production uploads (product images, 3D `.glb` models).
- Env vars are centralized conceptually in `.env` / `.env.example` at repo root (frontend `NEXT_PUBLIC_*`, API `API_PORT`/`DATABASE_URL`/`DIRECT_URL`/`JWT_SECRET`, AI service `AI_SERVICE_PORT`/`MODEL_PATH`, R2 credentials); each app also loads its own `.env`/`.env.local`/`.env.example`.
