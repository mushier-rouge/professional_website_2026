# Production E2E Test Report - 2025-12-26

## Target
- URL: https://professional-website-2026.vercel.app
- Scope: production-only validation (no local dev server)

## Methodology
- Manual: opened production homepage in browser and verified header/footer branding and auth widget state.
- Automated HTTP checks: GET + content checks for key public routes.
- Supabase API checks: created test users, logged in, upserted profiles, attempted core workflows.

## Coverage Summary
- Public routes checked: 12 passed, 2 failed (collections/issues 404).
- Auth API: 4/4 user creations, 4/4 password logins.
- Profile data: 4/4 upserts via Supabase API.
- Membership, articles, reviewer, admin, collections, issues flows: blocked by missing production schema.

## Public Route Results
- PASS: /, /about, /about/mission, /about/editorial-policy, /about/code-of-conduct, /about/governance,
  /about/privacy, /about/terms, /members, /articles, /membership-grades, /login
- FAIL: /collections (404), /issues (404)

## Auth and Data Layer Results
- Created test users (admin/editor/reviewer/member) using Supabase admin API.
- Logged in all test users with email/password (Supabase client).
- Upserted profile rows for all users.
- Membership application insert failed (missing columns in membership_applications).
- Article submission insert failed (missing columns in articles).
- Reviewer assignment blocked (roles table missing).
- Collections/issues creation failed (tables missing).
- Member directory did not show test profile (likely filtered by schema/RLS or page logic).

## Production Blockers
- Missing RBAC tables: public.roles not found (blocks editor/reviewer/admin checks).
- membership_applications missing new columns (achievements, publications, etc.).
- articles missing new columns (abstract, content, status, topics).
- collections and issues tables missing; routes return 404.

## Test Accounts Created (Production)
- admin: codex.e2e.admin+20251226024924808@example.com
- editor: codex.e2e.editor+20251226024924808@example.com
- reviewer: codex.e2e.reviewer+20251226024924808@example.com
- member: codex.e2e.member+20251226024924808@example.com

Note: Passwords are not stored in this report. Reset via Supabase dashboard if needed.

## Notes
- Vercel production envs updated for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
- A fresh Vercel deploy is required for env changes + new routes/migrations to take effect in prod.
