# LIMATA — Project File Directory

> **Architecture:** Feature-Based MVC Modular Monolith  
> **Stack:** Next.js 15 · Express.js · Prisma · PostgreSQL · FastAPI · Turborepo  
> **Last updated:** June 2026 — post MVC refactor + architecture cleanup

---

## Full Directory Tree

```
LIMATA-One-Click-Furniture-Store/
│
├── apps/
│   │
│   ├── ai-service/                              # FastAPI Python service
│   │   ├── app/
│   │   │   └── main.py                          # Health endpoint + app factory
│   │   ├── package.json
│   │   └── requirements.txt
│   │
│   ├── api/                                     # Express.js REST API (MVC)
│   │   ├── prisma.config.ts                     # Prisma CLI config (schema path, migrations)
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── app.ts                           # Express app — cors, routes, error handler
│   │       ├── index.ts                         # Entry point — loads env, imports server
│   │       ├── server.ts                        # app.listen()
│   │       │
│   │       ├── config/                          # Environment & app configuration
│   │       │   └── load-env.ts                  # Custom .env loader (monorepo-aware)
│   │       │
│   │       ├── lib/                             # External clients & shared utilities
│   │       │   ├── jwt.ts                       # generateToken / verifyToken (jsonwebtoken)
│   │       │   ├── prisma.ts                    # Lazy PrismaClient singleton
│   │       │   └── storage.ts                   # R2 / local file upload (AWS S3 SDK)
│   │       │
│   │       ├── middleware/                      # All Express middleware
│   │       │   ├── authenticate.ts              # JWT Bearer token verification
│   │       │   ├── authorize.ts                 # RBAC role enforcement
│   │       │   └── error-handler.ts             # Global Express error handler
│   │       │
│   │       ├── modules/                         # Feature modules (MVC per module)
│   │       │   │
│   │       │   ├── auth/                        # ✅ ACTIVE
│   │       │   │   ├── auth.controller.ts       # HTTP request/response handling
│   │       │   │   ├── auth.repository.ts       # Prisma user queries (DB layer only)
│   │       │   │   ├── auth.route.ts            # Route registration
│   │       │   │   ├── auth.service.ts          # Business logic (bcrypt, tokens)
│   │       │   │   ├── auth.types.ts            # AuthUser, AuthPayload, DTOs
│   │       │   │   ├── auth.validation.ts       # Zod schemas (register, login)
│   │       │   │   └── index.ts                 # Barrel — exports authRouter + types
│   │       │   │
│   │       │   ├── cart/                        # 🔲 PLACEHOLDER
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── chat/                        # 🔲 PLACEHOLDER
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── health/                      # ✅ ACTIVE
│   │       │   │   ├── health.route.ts          # GET /api/v1/health
│   │       │   │   └── index.ts                 # Barrel — exports healthRouter
│   │       │   │
│   │       │   ├── notifications/               # 🔲 PLACEHOLDER
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── orders/                      # 🔲 PLACEHOLDER
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── payments/                    # 🔲 PLACEHOLDER
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── placement/                   # 🔲 PLACEHOLDER (AR/3D)
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── products/                    # ✅ ACTIVE
│   │       │   │   ├── index.ts                 # Barrel — exports productsRouter + types
│   │       │   │   ├── product.controller.ts    # HTTP request/response handling
│   │       │   │   ├── product.repository.ts    # Prisma product queries (DB layer only)
│   │       │   │   ├── product.route.ts         # Route registration (public + admin)
│   │       │   │   ├── product.service.ts       # Business logic orchestration
│   │       │   │   ├── product.types.ts         # ProductListItem, ProductDetail DTOs
│   │       │   │   └── product.validation.ts    # Zod schemas (create, update, query)
│   │       │   │
│   │       │   ├── recommendations/             # 🔲 PLACEHOLDER (AI-powered)
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── reviews/                     # 🔲 PLACEHOLDER
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   └── wishlist/                    # 🔲 PLACEHOLDER
│   │       │       └── index.ts
│   │       │
│   │       ├── shared/                          # Cross-cutting concerns
│   │       │   ├── constants/
│   │       │   │   └── index.ts                 # Project-wide constants (placeholder)
│   │       │   ├── errors/
│   │       │   │   └── api-error.ts             # ApiError class (statusCode + message)
│   │       │   ├── responses/
│   │       │   │   └── api-response.ts          # ApiResponse<T> type
│   │       │   └── utils/
│   │       │       └── index.ts                 # Shared utility functions (placeholder)
│   │       │
│   │       └── types/                           # Global type augmentations
│   │           └── express.d.ts                 # req.user augmentation
│   │
│   └── web/                                     # Next.js 15 frontend (App Router)
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── components.json                      # shadcn/ui config
│       ├── tsconfig.json
│       ├── public/
│       │   ├── images/                          # Static product & category images
│       │   │   ├── bed1.png / bed1.svg
│       │   │   ├── chair1.png / chair1.svg
│       │   │   ├── dining1.png / dining1.svg
│       │   │   ├── sofa1.png / sofa1.svg
│       │   │   ├── tvstand1.png
│       │   │   ├── wardrobe1.png
│       │   │   ├── hero.svg
│       │   │   ├── category-bedroom.svg
│       │   │   ├── category-dining.svg
│       │   │   ├── category-living.svg
│       │   │   ├── category-office.svg
│       │   │   └── category-storage.svg
│       │   └── *.svg                            # Next.js default SVGs
│       └── src/
│           ├── app/                             # Next.js App Router pages
│           │   ├── layout.tsx                   # Root layout
│           │   ├── page.tsx                     # Home page
│           │   ├── globals.css
│           │   ├── login/
│           │   │   └── page.tsx
│           │   ├── register/
│           │   │   └── page.tsx
│           │   ├── dashboard/
│           │   │   └── page.tsx
│           │   ├── profile/
│           │   │   └── page.tsx
│           │   ├── products/
│           │   │   ├── page.tsx                 # Product listing
│           │   │   └── [id]/
│           │   │       └── page.tsx             # Product detail
│           │   └── admin/
│           │       ├── layout.tsx               # Admin layout wrapper
│           │       ├── page.tsx                 # Admin dashboard
│           │       ├── footer/page.tsx
│           │       ├── homepage/page.tsx
│           │       ├── orders/page.tsx
│           │       ├── settings/page.tsx
│           │       └── products/
│           │           ├── page.tsx             # Product management list
│           │           ├── new/page.tsx         # Create product
│           │           └── [id]/edit/page.tsx   # Edit product
│           │
│           ├── components/                      # Shared UI layout components
│           │   └── layout/
│           │       ├── admin-layout.tsx
│           │       ├── admin-sidebar.tsx
│           │       ├── footer.tsx
│           │       ├── main-layout.tsx
│           │       └── navbar.tsx
│           │
│           ├── features/                        # Domain feature modules
│           │   ├── admin-products/
│           │   │   ├── components/
│           │   │   │   ├── image-upload.tsx
│           │   │   │   ├── model-upload.tsx
│           │   │   │   ├── product-form.tsx
│           │   │   │   └── product-table.tsx
│           │   │   ├── hooks/
│           │   │   │   ├── use-admin-products.tsx
│           │   │   │   ├── use-create-product.tsx
│           │   │   │   ├── use-delete-product.tsx
│           │   │   │   └── use-update-product.tsx
│           │   │   └── services/
│           │   │       └── admin-product.service.ts
│           │   │
│           │   ├── app/
│           │   │   └── store/use-ui-store.ts
│           │   │
│           │   ├── auth/
│           │   │   ├── api/auth.ts
│           │   │   ├── components/
│           │   │   │   ├── login-form.tsx
│           │   │   │   └── register-form.tsx
│           │   │   ├── hooks/use-auth-session.ts
│           │   │   ├── schemas/auth.schemas.ts
│           │   │   ├── store/use-auth-store.ts
│           │   │   └── types/auth.types.ts
│           │   │
│           │   ├── home/
│           │   │   └── components/
│           │   │       ├── ai-features-section.tsx
│           │   │       ├── categories-section.tsx
│           │   │       ├── cta-section.tsx
│           │   │       ├── featured-products.tsx
│           │   │       ├── features-section.tsx
│           │   │       └── hero-section.tsx
│           │   │
│           │   └── products/
│           │       ├── components/
│           │       │   ├── category-filter.tsx
│           │       │   ├── product-card.tsx
│           │       │   ├── product-details-skeleton.tsx
│           │       │   ├── product-details-view.tsx
│           │       │   ├── product-empty.tsx
│           │       │   ├── product-error.tsx
│           │       │   ├── product-grid.tsx
│           │       │   ├── product-search.tsx
│           │       │   └── product-skeleton.tsx
│           │       ├── hooks/
│           │       │   ├── use-product.tsx
│           │       │   └── use-products.tsx
│           │       ├── services/product.service.ts
│           │       └── types/product.types.ts
│           │
│           ├── lib/
│           │   ├── api-client.ts
│           │   ├── axios.ts
│           │   └── utils.ts
│           │
│           ├── providers/
│           │   ├── index.tsx
│           │   └── react-query-provider.tsx
│           │
│           └── store/
│               └── use-ui-store.ts
│
├── packages/                                    # Shared workspace packages
│   ├── config/                                  # ESLint, TypeScript, Prettier configs
│   │   ├── eslint/
│   │   │   ├── next.mjs
│   │   │   └── node.mjs
│   │   ├── prettier/
│   │   │   └── prettier.config.cjs
│   │   └── typescript/
│   │       ├── base.json
│   │       ├── nextjs.json
│   │       └── node.json
│   ├── types/                                   # Shared TypeScript types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/index.ts
│   └── ui/                                      # Shared shadcn/ui-style components
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── components/button.tsx
│           ├── index.ts
│           └── lib/utils.ts
│
├── prisma/                                      # Database schema & migrations (shared)
│   ├── schema.prisma                            # User, Product models; Role enum
│   ├── seed.ts
│   ├── seed.js
│   └── migrations/
│       ├── 20260526193053_init/
│       │   └── migration.sql
│       ├── 20260529093654_init_auth/
│       │   └── migration.sql
│       ├── 20260602114405_product_module/
│       │   └── migration.sql
│       ├── 20260603092548_add_model3d_url/
│       │   └── migration.sql
│       └── migration_lock.toml
│
├── .env                                         # Root environment variables (gitignored)
├── .env.example
├── .gitignore
├── .prettierrc.cjs
├── docker-compose.yml
├── FILE_DIRECTORY.md                            # ← this file
├── LICENSE
├── package.json                                 # Monorepo root scripts (turbo dev/build)
├── pnpm-workspace.yaml
├── README.md
└── turbo.json                                   # Turborepo task pipeline
```

---

## API Layer Responsibility Matrix

| Layer | File pattern | Responsibility |
|-------|-------------|----------------|
| **Routes** | `*.route.ts` | Register endpoints only — zero logic |
| **Controllers** | `*.controller.ts` | Parse request → call service → send HTTP response |
| **Services** | `*.service.ts` | Business logic, orchestration, workflow |
| **Repositories** | `*.repository.ts` | Prisma DB queries only — zero business logic |
| **Validation** | `*.validation.ts` | Zod input schemas |
| **Types** | `*.types.ts` | Module-scoped DTOs and interfaces |
| **Barrel** | `index.ts` | Re-exports the module's public API |

---

## Active API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/health` | Public | Health check |
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login — returns JWT |
| `GET` | `/api/auth/profile` | 🔒 User | Get own profile |
| `GET` | `/api/auth/admin` | 🔒 Admin | Admin access check |
| `GET` | `/api/products` | Public | List products (`?search=`, `?category=`) |
| `GET` | `/api/products/:id` | Public | Get product detail |
| `POST` | `/api/products` | 🔒 Admin | Create product |
| `PUT` | `/api/products/:id` | 🔒 Admin | Update product |
| `DELETE` | `/api/products/:id` | 🔒 Admin | Delete product |
| `POST` | `/api/products/upload-images` | 🔒 Admin | Upload product images (multipart) |
| `POST` | `/api/products/upload-model` | 🔒 Admin | Upload 3D model `.glb` (multipart) |

---

## Placeholder Modules (Not Yet Implemented)

| Module | Planned API prefix | Purpose |
|--------|--------------------|---------|
| `wishlist` | `/api/wishlist` | User product wishlist |
| `cart` | `/api/cart` | Shopping cart |
| `orders` | `/api/orders` | Order lifecycle management |
| `payments` | `/api/payments` | Payment processing & webhooks |
| `reviews` | `/api/products/:id/reviews` | Product review system |
| `chat` | `/api/chat` | Real-time messaging |
| `notifications` | `/api/notifications` | In-app notifications |
| `recommendations` | `/api/recommendations` | AI-powered recommendations |
| `placement` | `/api/placement` | AR/3D furniture placement |

---

## Prisma Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float
  stock       Int
  category    String
  material    String?
  images      String[]
  model3dUrl  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role {
  CUSTOMER
  ADMIN
}
```

---

## Key Environment Variables

| Variable | Used by | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Prisma | PostgreSQL pooled connection |
| `DIRECT_URL` | Prisma | PostgreSQL direct connection |
| `JWT_SECRET` | `lib/jwt.ts` | JWT signing secret |
| `API_PORT` | `server.ts` | HTTP port (default: 4000) |
| `FRONTEND_URL` | `app.ts` | CORS allowed origins (comma-separated) |
| `API_PUBLIC_URL` | `lib/storage.ts` | Public base URL for local file uploads |
| `R2_ENDPOINT` | `lib/storage.ts` | Cloudflare R2 endpoint |
| `R2_ACCESS_KEY_ID` | `lib/storage.ts` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | `lib/storage.ts` | R2 secret key |
| `R2_BUCKET_NAME` | `lib/storage.ts` | R2 bucket name |
| `R2_PUBLIC_URL` | `lib/storage.ts` | R2 public CDN URL |
| `NEXT_PUBLIC_API_BASE_URL` | Next.js web | API base URL consumed by frontend |
