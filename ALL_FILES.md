# LIMATA-One-Click-Furniture-Store Workspace Export

This file is a prompt-style snapshot of the workspace for external analysis.

## Notes

- `node_modules` and installed package contents are intentionally excluded.
- `pnpm-lock.yaml` is omitted because it is generated and very large.
- Binary assets such as `apps/web/src/app/favicon.ico` and `apps/web/public/*.svg` are listed in the workspace tree but omitted from inline contents.
- Packages installed successfully in this workspace.

## Workspace Tree

- LICENSE
- README.md
- .env.example
- .gitignore
- .prettierignore
- .prettierrc.cjs
- ALL_FILES.md
- docker-compose.yml
- package.json
- pnpm-lock.yaml (generated, omitted)
- pnpm-workspace.yaml
- turbo.json
- workspace-prompt.md
- apps/ai-service/.env.example
- apps/ai-service/.gitignore
- apps/ai-service/app/main.py
- apps/ai-service/package.json
- apps/ai-service/requirements.txt
- apps/api/.env.example
- apps/api/.gitignore
- apps/api/eslint.config.mjs
- apps/api/package.json
- apps/api/prisma.config.ts
- apps/api/src/app.ts
- apps/api/src/config/load-env.ts
- apps/api/src/index.ts
- apps/api/src/lib/prisma.ts
- apps/api/src/modules/health/health.route.ts
- apps/api/src/server.ts
- apps/api/src/shared/middleware/error-handler.ts
- apps/api/src/shared/middleware/responses/api-response.ts
- apps/api/tsconfig.json
- apps/web/.eslintrc.json
- apps/web/.gitignore
- apps/web/components.json
- apps/web/next.config.ts
- apps/web/package.json
- apps/web/postcss.config.mjs
- apps/web/public/file.svg (binary omitted)
- apps/web/public/globe.svg (binary omitted)
- apps/web/public/next.svg (binary omitted)
- apps/web/public/vercel.svg (binary omitted)
- apps/web/public/window.svg (binary omitted)
- apps/web/src/app/favicon.ico (binary omitted)
- apps/web/src/app/globals.css
- apps/web/src/app/layout.tsx
- apps/web/src/app/page.tsx
- apps/web/src/components/layout/footer.tsx
- apps/web/src/components/layout/main-layout.tsx
- apps/web/src/components/layout/navbar.tsx
- apps/web/src/features/app/store/use-ui-store.ts
- apps/web/src/lib/api-client.ts
- apps/web/src/lib/utils.ts
- apps/web/src/providers/react-query-provider.tsx
- apps/web/src/store/use-ui-store.ts
- apps/web/tsconfig.json
- packages/config/eslint/next.mjs
- packages/config/eslint/node.mjs
- packages/config/package.json
- packages/config/prettier/prettier.config.cjs
- packages/config/typescript/base.json
- packages/config/typescript/nextjs.json
- packages/config/typescript/node.json
- packages/types/package.json
- packages/types/src/index.ts
- packages/types/tsconfig.json
- packages/ui/package.json
- packages/ui/src/components/button.tsx
- packages/ui/src/index.ts
- packages/ui/src/lib/utils.ts
- packages/ui/tsconfig.json
- prisma/migrations/20260526193053_init/migration.sql
- prisma/migrations/migration_lock.toml
- prisma/schema.prisma

## Root Files

### LICENSE
~~~text
MIT License

Copyright (c) 2026 Manula Chandupa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
~~~

### README.md
~~~md
# LIMATA-One-Click-Furniture-Store

Beginner-friendly modular monorepo starter for LIMATA (AI-assisted furniture ecommerce platform).

## Workspace

- `apps/web` — Next.js 15 (App Router, TypeScript, Tailwind, React Query, Zustand)
- `apps/api` — Express.js + Prisma + PostgreSQL starter
- `apps/ai-service` — FastAPI starter
- `packages/ui` — shared shadcn/ui-style components
- `packages/types` — shared TypeScript types
- `packages/config` — shared TypeScript, ESLint, and Prettier configs

## Getting started

```bash
pnpm install
pnpm dev
```
~~~

### .env.example
~~~env
# Web
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# API
API_PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/limata

# AI Service
AI_SERVICE_PORT=8000
~~~

### .gitignore
~~~gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.*
!.env.example

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist
.output

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp directory
.temp

# Sveltekit cache directory
.svelte-kit/

# vitepress build output
**/.vitepress/dist

# vitepress cache directory
**/.vitepress/cache

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# Firebase cache directory
.firebase/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# pnpm
.pnpm-store
.turbo

# Python
__pycache__/
*.pyc
.pytest_cache/

# yarn v3
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# Vite files
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
.vite/

# OS, IDE and editor files
.DS_Store
Thumbs.db
desktop.ini

# IDE directories
.idea/
.vscode/

# Build outputs (additional)
/build

# Local env files (already generally covered but keep explicit common patterns)
.env.local
.env.*.local

# Misc
npm-debug.log*
.cache/

```gitignore
# =========================
# LIMATA Specific
# =========================

# AI model weights
*.pt
*.pth
weights/
models/

# Upload folders
uploads/
temp/

# Render
.render

# Jupyter notebooks
.ipynb_checkpoints/

# AI virtual environments
venv/
env/
.venv/

# Optional generated Python runtime folders
Python/
Python/**
```
~~~

### .prettierignore
~~~text
node_modules
.next
dist
coverage
pnpm-lock.yaml
~~~

### .prettierrc.cjs
~~~js
module.exports = require("@limata/config/prettier");
~~~

### docker-compose.yml
~~~yaml
services:
  postgres:
    image: postgres:16
    container_name: limata-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: limata
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
~~~

### package.json
~~~json
{
  "name": "limata-monorepo",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "prettier --check .",
    "format:write": "prettier --write ."
  },
  "devDependencies": {
    "@limata/config": "workspace:*",
    "prettier": "^3.6.2",
    "turbo": "^2.5.8"
  }
}
~~~

### pnpm-workspace.yaml
~~~yaml
packages:
  - apps/*
  - packages/*
~~~

### turbo.json
~~~json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
~~~

## apps/ai-service

### apps/ai-service/package.json
~~~json
{
  "name": "ai-service",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "python -m uvicorn app.main:app --reload --port 8000",
    "start": "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
  }
}
~~~

### apps/ai-service/requirements.txt
~~~text
fastapi==0.121.1
uvicorn[standard]==0.38.0
~~~

### apps/ai-service/.env.example
~~~text
AI_SERVICE_PORT=8000
~~~

### apps/ai-service/.gitignore
~~~gitignore
# Ignore bundled Python runtime and caches
Python/
Python/**
__pycache__/
*.pyc
*.pyo
venv/
env/
.venv/
pip-wheel-metadata/
build/
dist/
.pytest_cache/

# Node / JS
node_modules/

# Logs
*.log
.turbo
~~~

### apps/ai-service/app/main.py
~~~python
from fastapi import FastAPI

app = FastAPI(title="LIMATA AI Service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ai-service"}
~~~

## apps/api

### apps/api/package.json
~~~json
{
  "name": "api",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@prisma/client": "6",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.21.2",
    "pg": "^8.16.3"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^4.17.23",
    "@types/node": "^20.19.25",
    "@typescript-eslint/eslint-plugin": "^8.46.4",
    "@typescript-eslint/parser": "^8.46.4",
    "eslint": "^9.39.1",
    "prisma": "6",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3"
  }
}
~~~

### apps/api/eslint.config.mjs
~~~js
import nodeConfig from "@limata/config/eslint/node";

export default nodeConfig;
~~~

### apps/api/.gitignore
~~~gitignore
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment
.env
.env.*

# Logs
*.log

# Temporary files
temp/
uploads/

# Turbo
.turbo
~~~

### apps/api/.env.example
~~~env
API_PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/limata
~~~

### apps/api/prisma.config.ts
~~~ts
import { defineConfig } from "prisma/config";
import { loadProjectEnv } from "./src/config/load-env";

loadProjectEnv();

export default defineConfig({
  schema: "../../prisma/schema.prisma",
  migrations: {
    path: "../../prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
~~~

### apps/api/tsconfig.json
~~~json
{
  "extends": "@limata/config/typescript/node",
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["src/**/*.ts", "prisma/**/*.ts", "prisma.config.ts"],
  "exclude": ["node_modules", "dist"]
}
~~~

### apps/api/src/index.ts
~~~ts
import "./server";
~~~

### apps/api/src/app.ts
~~~ts
import express from "express";
import cors from "cors";
import { errorHandler } from "./shared/middleware/error-handler";

const app = express();

app.use(cors());
app.use(express.json());

app.use(errorHandler);

export default app;
~~~

### apps/api/src/server.ts
~~~ts
import app from "./app";
import { loadProjectEnv } from "./config/load-env";
import { healthRouter } from "./modules/health/health.route";

loadProjectEnv();

const port = Number(process.env.API_PORT ?? 4000);

app.use("/api/v1/health", healthRouter);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
~~~

### apps/api/src/config/load-env.ts
~~~ts
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(envPath: string) {
  if (!existsSync(envPath)) {
    return;
  }

  const envFile = readFileSync(envPath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function loadProjectEnv() {
  const workspaceRootEnvPath = resolve(process.cwd(), "../../.env");
  const apiLocalEnvPath = resolve(process.cwd(), ".env");

  loadEnvFile(workspaceRootEnvPath);
  loadEnvFile(apiLocalEnvPath);
}
~~~

### apps/api/src/lib/prisma.ts
~~~ts
~~~

### apps/api/src/modules/health/health.route.ts
~~~ts
import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api",
  });
});
~~~

### apps/api/src/shared/middleware/error-handler.ts
~~~ts
import { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const message =
    error instanceof Error ? error.message : "Internal Server Error";

  res.status(500).json({
    success: false,
    message,
  });
}
~~~

### apps/api/src/shared/middleware/responses/api-response.ts
~~~ts
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
~~~

## packages/config

### packages/config/package.json
~~~json
{
  "name": "@limata/config",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    "./typescript/base": "./typescript/base.json",
    "./typescript/nextjs": "./typescript/nextjs.json",
    "./typescript/node": "./typescript/node.json",
    "./eslint/next": "./eslint/next.mjs",
    "./eslint/node": "./eslint/node.mjs",
    "./prettier": "./prettier/prettier.config.cjs"
  },
  "dependencies": {
    "@eslint/js": "^9.39.1",
    "@typescript-eslint/eslint-plugin": "^8.46.4",
    "@typescript-eslint/parser": "^8.46.4",
    "eslint": "^9.39.1",
    "eslint-config-next": "15.5.18",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.46.4"
  }
}
~~~

### packages/config/typescript/base.json
~~~json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}
~~~

### packages/config/typescript/node.json
~~~json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["node"],
    "moduleResolution": "NodeNext",
    "module": "NodeNext"
  }
}
~~~

### packages/config/typescript/nextjs.json
~~~json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "incremental": true,
    "isolatedModules": true,
    "jsx": "preserve"
  }
}
~~~

### packages/config/prettier/prettier.config.cjs
~~~js
module.exports = require("@limata/config/prettier");
~~~

### packages/config/eslint/node.mjs
~~~js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
);
~~~

### packages/config/eslint/next.mjs
~~~js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

export default defineConfig([
  nextVitals,
  nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
~~~

## packages/types

### packages/types/package.json
~~~json
{
  "name": "@limata/types",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "echo \"No shared types lint step yet\"",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
~~~

### packages/types/tsconfig.json
~~~json
{
  "extends": "@limata/config/typescript/base",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
~~~

### packages/types/src/index.ts
~~~ts
export type ServiceStatus = "ok" | "error";

export type HealthResponse = {
  status: ServiceStatus;
  service: string;
};
~~~

## packages/ui

### packages/ui/package.json
~~~json
{
  "name": "@limata/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "echo \"No UI lint step yet\"",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.2.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.554.0",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@types/react": "^19.2.2",
    "typescript": "^5.9.3"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
~~~

### packages/ui/tsconfig.json
~~~json
{
  "extends": "@limata/config/typescript/base",
  "compilerOptions": {
    "jsx": "react-jsx"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
~~~

### packages/ui/src/index.ts
~~~ts
export * from "./components/button";
export * from "./lib/utils";
~~~

### packages/ui/src/lib/utils.ts
~~~ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
~~~

### packages/ui/src/components/button.tsx
~~~tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        outline: "border border-slate-300 bg-transparent hover:bg-slate-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
~~~

## apps/web

### apps/web/package.json
~~~json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,


  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@limata/types": "workspace:*",
    "@limata/ui": "workspace:*",
    "@tanstack/react-query": "^5.90.3",
    "axios": "^1.16.1",
    "next": "15.5.18",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.17",
    "@types/node": "^20.19.25",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "eslint": "^9.39.1",
    "eslint-config-next": "15.5.18",
    "typescript": "^5.9.3"
  }
  
}
~~~

### apps/web/tsconfig.json
~~~json
{
  "extends": "@limata/config/typescript/nextjs",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
~~~

### apps/web/next.config.ts
~~~ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@limata/ui"],
};

export default nextConfig;
~~~

### apps/web/components.json
~~~json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
~~~

### apps/web/.gitignore
~~~gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```gitignore
# Turbo
.turbo

# Logs
*.log

# Cache
.cache/

# Vite temp files (safe for future tooling)
.vite/

# Local uploads/temp
uploads/
temp/
```
~~~

### apps/web/.eslintrc.json
~~~json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
~~~

### apps/web/postcss.config.mjs
~~~js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
~~~

### apps/web/src/app/layout.tsx
~~~tsx
import type { Metadata } from "next";
import { ReactQueryProvider } from "@/providers/react-query-provider";
// import "./globals.css";

export const metadata: Metadata = {
  // title: "LIMATA",
  description: "AI-assisted furniture ecommerce monorepo starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
~~~

### apps/web/src/app/page.tsx
~~~tsx
import { MainLayout } from "@/components/layout/main-layout";

export default function HomePage() {
  return (
    <MainLayout>
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold">LIMATA</h1>
          <p className="mt-4 text-lg text-slate-600">
            AI-assisted furniture ecommerce platform
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
~~~

### apps/web/src/app/globals.css
~~~css
@import "tailwindcss";
@source "../../../packages/ui/src/**/*.{ts,tsx}";

:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --muted-foreground: #475569;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted-foreground: var(--muted-foreground);
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
}

body {
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}
~~~

### apps/web/src/components/layout/navbar.tsx
~~~tsx
export function Navbar() {
  return (
    <nav className="border-b px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-xl font-bold">LIMATA</h1>
      </div>
    </nav>
  );
}
~~~

### apps/web/src/components/layout/main-layout.tsx
~~~tsx
import { Footer } from "./footer";
import { Navbar } from "./navbar";

export function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
~~~

### apps/web/src/components/layout/footer.tsx
~~~tsx
export function Footer() {
  return (
    <footer className="border-t px-6 py-6 text-center text-sm">
      LIMATA © 2026
    </footer>
  );
}
~~~

### apps/web/src/providers/react-query-provider.tsx
~~~tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
~~~

### apps/web/src/lib/api-client.ts
~~~ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
~~~

### apps/web/src/lib/utils.ts
~~~ts
export { cn } from "@limata/ui";
~~~

### apps/web/src/store/use-ui-store.ts
~~~ts
~~~

### apps/web/src/features/app/store/use-ui-store.ts
~~~ts
import { create } from "zustand";

type UiStore = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
~~~

## Prisma

### prisma/schema.prisma
~~~prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  CUSTOMER
  SELLER
  ADMIN
}
~~~

### prisma/migrations/migration_lock.toml
~~~toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"
~~~

### prisma/migrations/20260526193053_init/migration.sql
~~~sql
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'SELLER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
~~~
