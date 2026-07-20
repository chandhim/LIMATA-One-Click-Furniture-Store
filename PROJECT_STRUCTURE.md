# LIMATA CODEBASE ANALYSIS & ARCHITECTURE DOCUMENT

This document provides a comprehensive overview of the LIMATA project architecture, structure, and current implementation status. It serves as the primary technical reference for developers.

---

## 1. Project Overview

**LIMATA** is a modern e-commerce platform specializing in furniture. It provides an end-to-end shopping experience featuring product listings, a 3D/AR product viewer, a real-time chat system, order processing, and a complete admin dashboard for store management. 

The project is structured as a **monorepo** utilizing Turborepo, separating the frontend (Web) and backend (API) while sharing common configurations, types, and UI components.

---

## 2. Technology Stack

### Backend (`apps/api`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Real-time:** Socket.IO
- **Storage:** AWS S3 SDK (Cloudflare R2)
- **Validation:** Zod
- **Authentication:** JWT, bcryptjs

### Frontend (`apps/web`)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4), Lucide React
- **State Management:** Zustand, React Query
- **3D/AR:** Three.js, React Three Fiber/Drei, Google Model Viewer
- **Forms & Validation:** React Hook Form, Zod
- **Real-time:** Socket.IO Client

---

## 3. Monorepo Structure

```text
E:\REACT_PROJECTS\LIMATA\LIMATA-ONE-CLICK-FURNITURE-STORE
├── apps/
│   ├── api/          # Express.js Backend server
│   └── web/          # Next.js Frontend application
├── packages/
│   ├── config/       # Shared ESLint/Prettier configurations
│   ├── types/        # Shared TypeScript definitions
│   └── ui/           # Shared UI components (Tailwind)
├── prisma/           # Database schema and migrations
│   └── schema.prisma # Centralized database schema
├── turbo.json        # Turborepo configuration
├── pnpm-workspace.yaml # pnpm workspaces configuration
└── package.json      # Root dependencies and scripts
```

---

## 4. Backend Architecture

The backend (`apps/api`) is organized into modular features, following a layered architecture (Controller -> Service -> Repository).

```text
apps/api/src/
├── config/           # Environment configuration
├── lib/              # Core libraries (Prisma, Storage, JWT)
├── middleware/       # Express middlewares (Auth, Error handling)
├── modules/          # Feature-based modules
│   ├── admin/        # Admin endpoints
│   ├── auth/         # Authentication (Login, Register)
│   ├── cart/         # Shopping cart operations
│   ├── chat/         # Real-time chat history & REST endpoints
│   ├── health/       # Health checks
│   ├── notifications/# In-app notifications
│   ├── orders/       # Order processing and management
│   ├── payments/     # Payment gateway webhooks & verification
│   ├── products/     # Product catalog & GLB optimization
│   ├── reviews/      # Product reviews
│   └── wishlist/     # User wishlist operations
├── shared/           # Shared backend utilities & error responses
├── socket/           # Socket.IO handlers for real-time features
└── index.ts          # Entry point
```

**Responsibilities:**
- **Controllers:** Handle HTTP requests, parse inputs, and return responses.
- **Services:** Contain the core business logic (e.g., verifying payments, checking stock).
- **Repositories:** Direct database interactions via Prisma.
- **Routes:** Map endpoints to controller methods.

---

## 5. Frontend Architecture

The frontend (`apps/web`) uses Next.js App Router and organizes code by grouping routes and extracting domain-specific logic into a `features` directory.

```text
apps/web/src/
├── app/              # Next.js App Router (Pages, Layouts)
│   ├── (store)/      # Public store routes (Home, Products, Cart, Checkout)
│   ├── account/      # Customer account (Orders, Reviews)
│   ├── admin/        # Admin dashboard (Products, Orders, Customers)
│   └── login/        # Auth routes
├── components/       # Global shared components (Layouts, Navbar, Footer)
├── features/         # Domain-specific logic and UI
│   ├── admin/
│   ├── admin-products/
│   ├── auth/
│   ├── cart/
│   ├── chat/
│   ├── home/
│   ├── notifications/
│   ├── orders/
│   ├── products/     # Includes AR Viewer & 3D components
│   └── wishlist/
├── lib/              # API clients, axios interceptors, generic utilities
├── providers/        # React context providers (Query, Auth, Socket)
└── store/            # Global Zustand stores (Cart, UI, Wishlist)
```

---

## 6. Shared Packages

- **`@limata/types`**: Contains TypeScript interfaces and Zod schemas shared between frontend and backend.
- **`@limata/ui`**: Contains reusable UI components built with Tailwind CSS.
- **`@limata/config`**: Houses ESLint and Prettier configurations to maintain code consistency across apps.

---

## 7. Database Structure

The Prisma schema (`prisma/schema.prisma`) defines the following core models:

- **User**: Stores customer and admin data, linked to orders, reviews, and wishlist.
- **Product**: Holds product details, images, pricing, stock, and the `model3dUrl`.
- **Order / OrderItem**: Tracks customer purchases, payment methods, and statuses.
- **Cart / CartItem**: Manages the current shopping session per user.
- **Wishlist / WishlistItem**: Saved items for future purchases.
- **Review**: Product ratings and feedback left by users.
- **Conversation / Message**: Real-time customer support chat.
- **Notification**: System alerts sent to users or admins.
- **Category**: Product categorization.
- **StoreSetting**: Key-value pair configuration for store settings.

### Key Relationships
- A `User` has many `Orders`, `Reviews`, and one `Wishlist`.
- An `Order` contains many `OrderItems`, which reference `Products`.
- A `Conversation` links a `User` (Customer) to many `Messages`.

---

## 8. Authentication Flow

- **Registration/Login:** The frontend uses React Hook Form and Zod to validate input, then calls the backend `auth` module.
- **JWT:** The backend verifies credentials using `bcryptjs` and returns a JWT token.
- **Session Management:** The frontend stores the JWT and uses it via Axios interceptors (`apps/web/src/lib/api-client.ts`) for authenticated requests.
- **Role-based Access:** The backend uses the `authorize.ts` middleware to restrict specific routes (like `/api/admin/*`) to `ADMIN` users.

---

## 9. API Modules

- **Auth:** Handles user registration, login, profile updates.
- **Products:** CRUD for products, GLB optimization service (`glb-optimizer.service.ts`).
- **Cart & Wishlist:** Manage user-specific lists.
- **Orders:** Complex checkout flow, calculating shipping based on subtotal, handling transaction rollbacks if stock is unavailable.
- **Payments:** Manages PayHere MD5 signature generation and webhook verification, updating order statuses.
- **Chat:** Retrieves chat history for Socket.IO connections.
- **Admin:** Aggregates statistics and manages the overall store.

---

## 10. Frontend Features

- **Product 3D/AR Viewer:** Built with `@react-three/fiber` and Google Model Viewer for immersive product inspection.
- **Checkout Flow:** Integrates with PayHere and handles local state while redirecting to the payment gateway.
- **Real-time Chat:** A floating chat widget powered by Socket.IO for immediate customer support.
- **Notification Bell:** Real-time push alerts using Socket.IO, falling back to REST fetches via React Query.
- **Admin Dashboard:** A separate layout with a sidebar for managing the catalog, viewing orders, and chatting with customers.

---

## 11. Routing

### Frontend Routes (`apps/web/src/app`)
- `/` - Homepage
- `/products`, `/products/[productId]` - Catalog and Product details
- `/cart`, `/checkout` - Shopping flow
- `/account/orders`, `/account/orders/[orderId]` - Customer dashboard
- `/admin`, `/admin/products`, `/admin/orders`, `/admin/chats` - Admin Dashboard
- `/login`, `/register` - Authentication

### Backend Routes (`apps/api/src/modules`)
- `/api/auth/*`
- `/api/products/*`
- `/api/orders/*`
- `/api/payments/*`
- `/api/admin/*`
- `/api/chat/*`

---

## 12. Reusable Components

Located in `apps/web/src/features/*/components` and `packages/ui`:
- **`product-card.tsx`**: Standardized product display.
- **`product-3d-viewer.tsx` / `ar-launcher-view.tsx`**: Reusable WebGL and AR components.
- **`quantity-selector.tsx`**: Used in both product details and cart.
- **Forms:** Reusable `login-form.tsx`, `register-form.tsx`, and `product-form.tsx`.
- **Admin Layout:** Sidebar and Header wrappers for admin views.

---

## 13. Implemented Features

| Feature | Status |
|---|---|
| Authentication | ✅ |
| Landing Page | ✅ |
| Product Listing | ✅ |
| Product Details | ✅ |
| Admin Dashboard | ✅ |
| Chat | ✅ |
| Notifications | ✅ |
| Orders | ✅ |
| Payments (PayHere & COD) | ✅ |
| AR Viewer | ✅ |
| Reviews | ✅ |
| Recommendation Engine | ❌ |

---

## 14. Current Integrations

- **Prisma & PostgreSQL (Supabase):** Primary database and ORM.
- **AWS S3 SDK (Cloudflare R2):** Used in `apps/api/src/lib/storage.ts` for storing product images and `.glb` 3D models.
- **JWT:** User authentication and session management.
- **Socket.IO:** Powers the real-time chat and instant notifications (`apps/api/src/socket`).
- **PayHere:** Sri Lankan payment gateway integrated via `payment.service.ts` using MD5 hashing and webhooks.
- **React Query:** Manages server state and caching on the frontend.
- **Zustand:** Client-side UI state, Cart synchronization, and Wishlist toggling.
- **Google Model Viewer:** Powers the AR experience on mobile devices.

---

## 15. Missing Features

- **Recommendation Engine:** The API module (`apps/api/src/modules/recommendations`) is currently just a placeholder index file.
- **Advanced Analytics:** The admin dashboard lacks deep reporting tools or graphical charts.
- **AI Features:** The UI has an `ai-features-section.tsx` but the backend implementation for AI-driven search or chat bots is missing.

---

## 16. Technical Debt

- **Unused/Placeholder Modules:** The `recommendations` and `placement` directories exist in the API but lack implementation.
- **Duplicate Logic:** Shipping calculation logic is currently hardcoded in `order.service.ts` rather than being dynamic or configured via `StoreSetting`.
- **State Management Overlap:** Some data might be unnecessarily duplicated between React Query's cache and Zustand stores.
- **Error Handling:** While `ApiError` is used, some catch blocks lack detailed logging or fallback mechanisms.
- **Missing Tests:** There is a lack of automated unit and end-to-end testing across both the frontend and backend.

---

## 17. Future Development Opportunities

- **Recommendation Engine:** Integrate an AI/ML service to provide "Similar Products" and "Recommended for You" features. The API module is already scaffolded.
- **AI Chatbot / Search:** Enhance the existing Socket.IO chat to route to an LLM for automated customer support before handing off to a human admin.
- **Advanced Analytics:** Integrate tracking (e.g., PostHog, Google Analytics) and build visual charts for the admin dashboard.
- **Dynamic Shipping & Tax:** Move hardcoded shipping tiers to the database (`StoreSetting`) to allow admins to configure them dynamically.
- **Multi-currency Support:** Extend the `PayHere` integration and product models to handle currency conversions.
- **Automated Testing:** Implement Jest for the backend and Cypress/Playwright for critical frontend flows (Checkout, Login).
