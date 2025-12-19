# TODO List

| ID | TODO | Status | Notes |
| --- | --- | --- | --- |
| T-001 | Add test runner and `npm run test` script to enable pre-commit checks | completed | Decision: Vitest. |
| T-002 | Run `npm run lint`, `npm run test`, `npm run build`, and `npm run test:smoke` before every commit | completed | Enforced via Husky pre-commit hook (`npm run test:all`). |
| T-003 | Provision Vercel project via CLI | blocked | Missing Vercel access token for CLI auth. |
| T-004 | Provision Supabase project via CLI | blocked | Missing Supabase access token for CLI auth. |
| T-005 | Choose CI runner (GitHub Actions vs Vercel Checks) | completed | Decision: GitHub Actions. |
| T-006 | Decide whether to update Supabase CLI to v2.67.1 | pending | Current version is v2.65.5. |
| T-007 | Document project identifiers and env var requirements | completed | Stored in docs/setup_guide.md. |
| T-008 | Add ADR 001 for the tech stack decision | completed | Stored in docs/adr/001-tech-stack.md. |
| T-009 | Add CI workflow doc and automation | completed | docs/workflow/ci_cd.md + .github/workflows/ci.yml. |
| T-010 | Implement login flow | completed | Supabase email/password UI at `/login` + middleware session refresh. |
| T-011 | Implement logout flow | completed | Supabase sign-out button in header. |
| T-012 | Implement create profile flow | completed | Implemented via upsert on `/profile/edit` (first save creates profile). |
| T-013 | Implement edit profile flow | completed | `/profile/edit` pre-fills existing values when schema is applied. |
| T-014 | Implement write article flow | in_progress | Article create UI added at `/articles/new`; PDF upload pending. |
| T-015 | Implement read article flow | in_progress | Article detail route `/articles/[id]` added; needs better error handling + access controls validation. |
| T-016 | Implement home page article feed | pending | Consider adding a small "Latest articles" section on `/`. |
| T-017 | Add public profile landing page | completed | Name, photo, email, education, and experience. |
| T-018 | Define membership grades and criteria | completed | Member / Senior Member / Fellow + criteria page. |
| T-019 | Add end-to-end smoke tests | completed | `scripts/smoke_test.mjs` verifies key routes. |
| T-020 | Implement membership upgrade application flow | completed | `/membership/apply` + `/account` application history (requires applying `supabase/migrations/20251219000000_init.sql`). |
| T-021 | Add account page | completed | `/account` shows session details, membership grade, and application history. |
| T-022 | Implement profile create/edit UI | completed | `/profile/edit` upserts into `profiles` (requires applying `supabase/migrations/20251219000000_init.sql`). |
| T-023 | Implement article feed + CRUD skeleton | in_progress | `/articles`, `/articles/new`, and `/articles/[id]` implemented; requires applying `supabase/migrations/20251219001000_articles.sql`. |
| T-024 | Implement article edit/delete flow | completed | `/articles/[id]/edit` + `supabase/migrations/20251219002000_articles_delete.sql`. |
| T-025 | Add PDF upload for articles | pending | Supabase Storage bucket + RLS + upload UI. |
