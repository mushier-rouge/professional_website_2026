# ADR 001: Tech Stack Selection

Date: 2025-12-18
Status: Accepted

## Context
We need a production-ready web app with fast iteration, reliable deployments, and built-in realtime capabilities for community features. The stack must support App Router patterns, typed APIs, and a low-friction developer workflow.

## Decision
Adopt the following stack:
- Next.js (App Router) for the full-stack React framework.
- TypeScript for type safety across UI and server.
- Tailwind CSS for rapid, consistent UI styling.
- Supabase (Auth, Postgres, Storage, Realtime) for backend services.
- Vercel for hosting, previews, and CI/CD integration.

## Rationale
- Next.js + Vercel provides fast deploys, preview URLs, and an integrated DX.
- Supabase provides SQL, Auth, Storage, and Realtime without custom infrastructure.
- TypeScript reduces runtime errors and improves refactor safety.
- Tailwind enables UI iteration without bloated CSS.

## Alternatives Considered
- Next.js + Prisma + PlanetScale: strong, but adds extra infra and less built-in realtime.
- Firebase: excellent realtime but weaker SQL ergonomics and vendor lock-in risk.
- AWS (Cognito + RDS + S3 + App Runner): flexible but higher setup cost.

## Consequences
- Faster initial delivery at the cost of some vendor lock-in.
- Realtime features are aligned with Supabase capabilities.
- Deployment and preview workflows are standardized around Vercel.
