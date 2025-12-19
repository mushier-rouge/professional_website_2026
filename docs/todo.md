# TODO List

| ID | TODO | Status | Notes |
| --- | --- | --- | --- |
| T-001 | Add test runner and `npm run test` script to enable pre-commit checks | completed | Decision: Vitest. |
| T-002 | Run `npm run test` and `npm run build` before every commit | in_progress | Ongoing workflow requirement. |
| T-003 | Provision Vercel project via CLI | blocked | Missing Vercel access token for CLI auth. |
| T-004 | Provision Supabase project via CLI | blocked | Missing Supabase access token for CLI auth. |
| T-005 | Choose CI runner (GitHub Actions vs Vercel Checks) | completed | Decision: GitHub Actions. |
| T-006 | Decide whether to update Supabase CLI to v2.67.1 | pending | Current version is v2.65.5. |
| T-007 | Document project identifiers and env var requirements | completed | Stored in docs/setup_guide.md. |
| T-008 | Add ADR 001 for the tech stack decision | completed | Stored in docs/adr/001-tech-stack.md. |
| T-009 | Add CI workflow doc and automation | completed | docs/workflow/ci_cd.md + .github/workflows/ci.yml. |
| T-010 | Implement login flow | pending | Auth UI + session handling + tests. |
| T-011 | Implement logout flow | pending | End session + redirect + tests. |
| T-012 | Implement create profile flow | pending | User profile model + form + tests. |
| T-013 | Implement edit profile flow | pending | Update profile + tests. |
| T-014 | Implement write article flow | pending | Create paper record + upload PDF + tests. |
| T-015 | Implement read article flow | pending | Article detail view + tests. |
| T-016 | Implement home page article feed | pending | List and filter + tests. |
