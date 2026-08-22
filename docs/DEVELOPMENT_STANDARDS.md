# LIMATA Development Standards

This document outlines the coding standards, repository rules, and workflows for the LIMATA team to ensure consistency and prevent "works on my machine" issues.

## 1. Version Consistency

All developers must standardize on the following tool versions:
- **Node.js**: v24.x (enforced via `.nvmrc`)
- **pnpm**: v10.x
- **Python**: v3.11.x

Do not update these core dependencies without team consensus.

## 2. Editor Configuration

We use `.editorconfig` to enforce consistent formatting across all IDEs (VSCode, IntelliJ, etc.):
- **Indentation**: 2 spaces (4 spaces for Python files).
- **Line Endings**: LF (`\n`) across all operating systems. Git handles line ending normalization via `.gitattributes`.
- **Encoding**: UTF-8.
- **Trailing Whitespace**: Removed automatically on save.
- **Final Newline**: Required.

Ensure your IDE has an EditorConfig plugin installed.

## 3. Environment Variables

- **Never commit `.env` files** containing secrets or local configuration.
- Any new environment variable required by the application MUST be documented in `.env.example`.
- `.env.example` must contain placeholder values or dummy data, never production secrets.

## 4. Python Workflows (AI Service)

- Always use a local virtual environment (`.venv`). Do not install dependencies globally.
- When adding a new dependency, use `pip install <package>` and immediately update `requirements.txt`:
  ```bash
  pip freeze > requirements.txt
  ```
- Do not commit platform-specific binaries or compiled `.pyc` files.
- PyTorch and Ultralytics models should be downloaded at runtime or managed via an external volume/storage, do not commit heavy `.pt` files to git.

## 5. Node Workspaces Workflow

- The project uses `pnpm` workspaces. 
- To add a dependency to a specific package, use the `--filter` flag:
  ```bash
  pnpm --filter web add <package>
  ```
- Do not use `npm` or `yarn` in this repository to avoid lockfile conflicts.

## 6. Docker Policy

- Docker and `docker-compose` are configured in this repository for **deployment parity testing and production packaging only**. 
- Developers are encouraged to run services natively (Node/Python) for local development to ensure rapid hot-reloading and easier debugging, unless testing infrastructure components like Redis or Postgres.

## 7. Commits and Branching

- Keep PRs scoped to a single feature or bug fix.
- Ensure all services (Web, API, AI) start successfully before merging to `main`.
