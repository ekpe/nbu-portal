# NBU Portal Implementation Plan

## 1. Purpose

This document defines the first implementation plan for the NBU Portal System.

It translates the architecture into a practical sequence of work for repository setup, module development, deployment, and MVP delivery.

---

## 2. Delivery Strategy

The NBU Portal will be delivered in phases using:

- one GitHub repository
- one Next.js application
- preview-first deployment on Vercel
- module-by-module implementation
- controlled schema evolution through Prisma migrations

---

## 3. Repository and Environment Strategy

### Branch Model
- `main` → production
- `develop` → integration/staging
- `feature/*` → preview builds

### Environments
- local
- preview
- production

### Pull Request Flow
1. create feature branch
2. implement work
3. open pull request
4. validate preview deployment
5. review and merge

---

## 4. Recommended Repository Structure

```text
nbu-portal/
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── docs/
│   ├── architecture/
│   ├── modules/
│   ├── roadmap/
│   └── decisions/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── modules/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   ├── config/
│   └── middleware.ts
├── tests/
├── scripts/
├── .env.example
├── package.json
└── README.md