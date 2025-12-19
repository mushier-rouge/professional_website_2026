# AI/ML Society Website - Implementation Plan (Living Doc)

Purpose: This document is the single source of truth for building the site. Keep it updated as decisions change.

Stack (locked): Vercel (hosting) + Supabase (Postgres, Auth, Storage) + Next.js (App Router) + TypeScript.

---

## 0) Project summary

### 0.1 Vision

Create an IEEE/BCS-style professional society website for AI/ML experts that combines:

- Member profiles (CV-like, credibility-first)
- Membership grades (Member / Senior Member / Fellow)
- Article publishing with an editorial workflow (draft -> review -> revisions -> publish)
- Governance + trust: criteria, policies, disclosures, audit trails

### 0.2 Primary outcomes

- Public visitors can browse Articles and Members without friction.
- Verified members can author/submit articles.
- Editors/reviewers can manage a clear workflow with traceable decisions.
- Membership grades are awarded via a structured process (endorsements + committee decision).

### 0.3 MVP scope (what must exist in v1)

- Public: Home, Articles browse/detail, Members directory/profile, About/policies
- Auth: signup/login, email verification, password reset
- Member profile management
- Article draft + submission + editorial review + publish
- Membership grade upgrade workflows (Senior application; Fellow nomination)
- RBAC + Supabase Row Level Security (RLS)
- Full testing suite and CI gating

---

## 1) Non-negotiables

### 1.1 Test-Driven Development (TDD) is mandatory

All functional work is done TDD-first.

- Write the failing test(s) -> implement minimal code -> refactor -> tests stay green.
- Every PR must include tests that prove the change.
- No "it works on my machine." CI is the source of truth.

### 1.2 Quality gates

- Unit tests pass
- Integration tests pass
- E2E tests pass
- Typecheck + lint pass
- DB migrations succeed in CI
- Supabase RLS policies tested

### 1.3 Don't merge without

- Acceptance criteria for the ticket implemented
- Test coverage added for new/changed logic
- Updated this doc if behavior or scope changed

---

## 2) Design direction (IEEE/BCS-inspired)

### 2.1 Design principles

- Academic credibility over social-network vibes
- Print-like reading experience (wide margins, clear hierarchy)
- Consistent metadata blocks (dates, authors, badges)
- Controlled taxonomy (avoid tag chaos)

### 2.2 Layout cues to emulate

- Meta-nav/header pattern with clear site links and right-aligned auth/join actions
- Abstract in a callout box at top of article pages
- Cite This modal/button with BibTeX/plain text exports
- References section with consistent formatting
- Optional side navigation for article sections (TOC)

### 2.3 Typography + UI

- Primary web font: Open Sans or equivalent (system fallback)
- Tight, precise spacing; no futuristic gimmicks
- Badges: subtle, professional

### 2.4 Components to standardize

- Badge component (Member/Senior/Fellow)
- Verification mini-badges (ORCID connected, etc.)
- Callout panels (Abstract, Disclosures, Reproducibility)
- Citation modal (BibTeX/APA/plain)
- Sticky Table of Contents for articles

---

## 3) Information architecture

### 3.1 Public navigation

- Home
- Articles (Browse/Search)
- Members (Directory/Search)
- About
  - Mission
  - Editorial Policy
  - Membership Grades & Criteria
  - Code of Conduct
  - Governance / Committees
  - Terms / Privacy
- Join / Login

### 3.2 Logged-in navigation

- Dashboard
- My Profile
- Write / Submit
- My Articles
- Membership Grade (apply/nominate + status)
- Settings

### 3.3 Staff navigation

- Editorial Dashboard
- Reviewer Dashboard
- Membership Committee Dashboard
- Admin

---

## 4) Roles, grades, and permissions

### 4.1 Roles (RBAC)

Roles are permissions, not prestige.

- public
- member
- reviewer
- editor
- membership_committee
- fellows_committee
- admin

### 4.2 Grades (prestige)

Grades are recognition, not permissions.

- Member (default)
- Senior Member
- Fellow

### 4.3 Key rules

- Grade badges appear on:
  - profiles
  - article bylines
  - member directory cards
- Committee actions require audit logs.

### 4.4 Permission matrix (minimum)

- Member: manage own profile; create/edit drafts; submit articles
- Reviewer: view assigned articles; submit reviews
- Editor: triage submissions; assign reviewers; request revisions; accept/reject; publish
- Committee: review grade apps/nominations; approve/reject; request info
- Admin: manage everything (roles, taxonomy, content takedowns)

---

## 5) Member profiles (CV-first)

### 5.1 Public profile fields

- Name
- Headshot
- Title/role
- Affiliation (optional)
- Location (optional)
- Short bio + long bio
- Expertise tags (controlled taxonomy)
- Links: website, GitHub, LinkedIn, Google Scholar, ORCID
- Selected Work list (3-10 items)
- Articles authored on the site

### 5.2 Privacy & visibility

- visibility: public / unlisted / private
- directory opt-out flag
- public email hidden by default

### 5.3 Verification (separate from grade)

- ORCID connected badge (recommended)
- email verified
- optional manual verification

---

## 6) Membership grade processes

### 6.1 Senior Member (application)

Flow: Member -> applies -> collects endorsements -> committee decision

Applicant provides:

- narrative summary
- structured evidence entries (category + link + dates + contribution)
- resume link optional

Endorsements:

- minimum endorsers: configurable (recommended 2-3)
- endorser must have an account
- endorsement includes relationship + conflict disclosure

Committee outcomes:

- approve
- reject
- needs more info

### 6.2 Fellow (nomination)

Flow: Senior/Fellow nominates -> nominee accepts -> endorsements -> fellows committee decision

Requirements:

- nominee must be Senior Member (recommended rule)
- stricter evidence rubric
- additional endorsers (recommended 3)

### 6.3 Public policy pages

- Grades & Criteria page describing: eligibility, process, and what badges mean
- Appeals / reapplication rules (simple)

---

## 7) Articles (journal-style CMS)

### 7.1 Article types

- Article
- Tutorial
- Survey
- Perspective
- Practice Note (repro/engineering)
- Editorial

### 7.2 Article schema (minimum)

- title, subtitle
- authors (linked to member profiles)
- abstract
- tags/topics
- body content (MDX/Markdown)
- figures/assets with captions + credits
- references (structured)
- disclosures (funding, conflicts)
- reproducibility panel (code, data, compute notes)

### 7.3 Workflow states (FSM)

- DRAFT
- SUBMITTED
- IN_REVIEW
- REVISION_REQUESTED
- RESUBMITTED
- ACCEPTED
- SCHEDULED
- PUBLISHED
- ARCHIVED
- RETRACTED

### 7.4 Authoring experience

- MDX editor with live preview
- section templates (Abstract, Intro, Methods, Results, Limitations)
- citation helper (paste DOI/arXiv/BibTeX)

### 7.5 Reviewer workflow

- assigned reviews only
- structured review form
- confidential notes to editor
- recommendation enum (accept/minor/major/reject)

### 7.6 Editorial dashboard

- submission queue
- assign reviewers
- decision letters + templates
- revision cycle management
- publish scheduling

---

## 8) Supabase architecture

### 8.1 Auth

- Supabase Auth (email/password)
- email verification required
- password reset

### 8.2 Database

- Postgres with migrations (SQL or Prisma migrations; choose one and stick to it)
- Strict RLS policies

### 8.3 Storage

- Use Supabase Storage for profile photos and article assets
- Store metadata in DB: caption, credit, alt text

---

## 9) Data model (tables)

This is the minimum recommended schema. Adjust as needed but keep auditability.

### 9.1 Core

- users (Supabase auth)
- member_profiles
- roles, permissions, user_roles
- grades (enum) + user_grade

### 9.2 Grade processes

- grade_applications
- grade_evidence
- grade_endorsements
- fellow_nominations (if separate)
- committee_votes (optional but recommended)

### 9.3 Articles

- articles
- article_authors
- article_revisions
- article_assets
- article_references
- review_assignments
- reviews
- editor_decisions

### 9.4 Governance

- audit_logs (append-only)
- reports (moderation)

---

## 10) Row Level Security (RLS) requirements

### 10.1 Rules (examples)

- Profiles: users can edit their own profile; public read if visibility=public
- Articles:
  - author can read/edit drafts they own
  - once SUBMITTED: author can't modify body except in REVISION_REQUESTED
  - editors can read/manage all
- Reviews:
  - reviewers can read/write only assigned reviews
  - authors cannot read confidential reviewer notes
- Grade applications:
  - candidate can read own application
  - committee roles can read all

### 10.2 RLS test plan

- Automated tests verifying allowed/denied queries for each role
- Include regression tests for policy changes

---

## 11) Testing strategy (TDD + full coverage)

### 11.1 Tooling (recommended)

- Unit/integration: Vitest or Jest
- API integration tests: Vitest/Jest + Supertest (if API routes) or direct fetch tests
- E2E: Playwright
- Type: TypeScript strict
- Lint/format: ESLint + Prettier

### 11.2 Test layers

Unit tests

- pure functions (workflow transitions, validation, scoring)

Integration tests

- DB interactions (Supabase local)
- RLS enforcement
- API endpoints

E2E tests

- signup/login
- profile edit
- create draft -> submit -> reviewer assigned -> review submitted -> revision requested -> resubmit -> publish
- senior application -> endorsements -> committee decision
- fellow nomination -> acceptance -> endorsements -> committee decision

### 11.3 TDD rules of engagement

For each ticket:

1. add failing test(s)
2. implement minimal code
3. refactor
4. ensure coverage + update doc if needed

### 11.4 CI gating (Vercel)

PR checks must run:

- typecheck
- lint
- unit+integration
- e2e (at least smoke suite)
- migration check

### 11.5 Agent execution protocol (continuous progress + extreme TDD)

Goal: The agent should always be making forward progress across stages without blocking on a single stage, while still enforcing strict TDD and CI quality gates.

#### 11.5.1 Single source of truth status file

The agent must maintain a status file in the repo root:

- Preferred: ./project_status.json
- Optional export: ./project_status.csv (generated from JSON for quick viewing)

Rules:

- The file is updated after every meaningful action (test added, migration created, endpoint implemented, PR opened, etc.).
- Updates must be atomic (write to temp file then rename) so it is never partially written.
- Every status change must include:
  - timestamp (ISO)
  - stage + task id
  - previous state -> new state
  - commit hash (if applicable)
  - test references added/updated
  - notes (short)

#### 11.5.2 JSON schema (authoritative)

Create project_status.json with this structure:

```json
{
  "meta": {
    "project": "AI/ML Society Website",
    "repo": "<repo-url-or-name>",
    "last_updated": "2025-12-18T00:00:00Z",
    "tdd_mode": "strict",
    "ci_required": true
  },
  "stages": [
    {
      "id": "S1",
      "name": "Foundations",
      "status": "in_progress",
      "progress": 0.35,
      "tasks": [
        {
          "id": "S1-T1",
          "title": "Supabase RLS baseline policies + tests",
          "status": "in_progress",
          "priority": "P0",
          "dependencies": [],
          "artifacts": {
            "tests": ["tests/rls/profiles.test.ts"],
            "migrations": ["supabase/migrations/20251218_rls_profiles.sql"],
            "routes": [],
            "docs": ["docs/rls.md"]
          },
          "tdd": {
            "red_tests": ["profiles RLS denies non-owner update"],
            "green_tests": ["profiles RLS allows owner update"],
            "coverage_note": "RLS allow/deny matrix covered"
          },
          "acceptance_criteria": [
            "Owner can update own profile",
            "Public can read public profiles",
            "Private profiles not readable by public"
          ],
          "last_action": {
            "ts": "2025-12-18T00:00:00Z",
            "action": "added failing tests",
            "commit": "<hash>",
            "notes": "Added RED tests for RLS deny paths"
          }
        }
      ]
    }
  ],
  "work_queue": {
    "policy": "maximize_parallel_progress",
    "active": ["S1-T1"],
    "ready": ["S2-T3", "S3-T1"],
    "blocked": [
      {
        "task": "S2-T1",
        "reason": "needs schema migration merged",
        "since": "2025-12-18T00:00:00Z"
      }
    ]
  },
  "quality": {
    "last_ci": {
      "ts": "2025-12-18T00:00:00Z",
      "result": "pass",
      "run_url": "<url>",
      "notes": "All green"
    },
    "test_health": {
      "unit_pass": true,
      "integration_pass": true,
      "e2e_pass": true,
      "flaky_tests": []
    }
  }
}
```

Status enums

- not_started | in_progress | blocked | in_review | done

Priority enums

- P0 (critical path) | P1 | P2

#### 11.5.3 CSV export format (optional, derived)

Generate project_status.csv from the JSON with columns:

- stage_id,stage_name,task_id,title,status,priority,progress,blocked_reason,last_updated,tests,migrations,routes

Example row:

```csv
S1,Foundations,S1-T1,"Supabase RLS baseline policies + tests",in_progress,P0,0.4,,2025-12-18T00:00:00Z,"tests/rls/profiles.test.ts","supabase/migrations/20251218_rls_profiles.sql",""
```

#### 11.5.4 Continuous execution loop (agent behavior)

The agent must operate in a continuous loop (local process / runner / script) that:

1. Reads project_status.json
2. Selects next actions using the policy below
3. Executes the smallest test-first step(s)
4. Updates status file
5. Commits frequently (small commits)
6. Pushes and opens PRs early

Work selection policy: maximize_parallel_progress

- Maintain 2-4 active tasks concurrently.
- Never start a task without:
  - acceptance criteria written
  - initial failing test(s) planned (or implemented immediately)
- Prefer tasks that:
  - unblock many downstream tasks (schema, RLS, core workflow)
  - add test scaffolding (Playwright harness, Supabase local harness)

Non-blocking rule (important):

- If a task is blocked (e.g., waiting on migration/PR), immediately:
  - mark it blocked with reason
  - pick another ready task
  - continue making progress elsewhere

#### 11.5.5 Extreme TDD rules (no exceptions)

For every feature/bug:

- Write RED test(s) first
- Only then implement minimal code to go GREEN
- Refactor only with GREEN tests

Enforce these checks in CI and locally:

- pnpm test (or equivalent)
- pnpm test:integration
- pnpm test:e2e (Playwright)
- pnpm typecheck
- pnpm lint

Definition of Done (per task)

- Acceptance criteria satisfied
- Tests prove behavior (including negative/deny cases)
- RLS policies covered where relevant
- E2E smoke updated if user journey impacted
- Doc updated if workflow/roles/states changed

#### 11.5.6 Test-first checklists (copy/paste per ticket)

API endpoint

- [ ] contract test: unauthorized denied
- [ ] contract test: authorized allowed
- [ ] validation tests (bad payload)
- [ ] RLS integration test (if DB writes)
- [ ] E2E smoke updated if exposed in UI

RLS policy

- [ ] allow tests for intended role(s)
- [ ] deny tests for everyone else
- [ ] regression test for edge case (status transitions)

Workflow state machine

- [ ] tests for valid transitions
- [ ] tests for invalid transitions (must reject)
- [ ] audit log asserted

#### 11.5.7 PR discipline

- Keep PRs small and mergeable.
- Open PR as soon as failing tests exist + scaffold is committed.
- Each PR description must include:
  - what tests were added
  - what behavior changed
  - how to run tests locally
  - reference to task id(s) in project_status.json

---

## 12) CI/CD + environments

### 12.1 Environments

- local (Supabase local)
- staging (Supabase project)
- production (Supabase project)

### 12.2 Deployments

- Vercel Preview deployments for every PR
- Staging deploy on merge to main
- Prod deploy on release tag

### 12.3 Database migrations

- Migrations are versioned and applied automatically in CI/CD
- Zero manual edits in production DB

---

## 13) Pages and acceptance criteria

### 13.1 Home

- Shows latest + featured articles
- Join/login CTA

### 13.2 Articles browse

- Search + filter by tag/topic/type
- Pagination

### 13.3 Article detail

- Abstract callout
- Byline with grade badges
- References section
- Cite this modal
- Disclosures + Repro panel

### 13.4 Members directory

- Search + filters (grade + expertise)

### 13.5 Member profile

- Public CV-like profile
- Private edit mode

### 13.6 Dashboards

- Member dashboard: profile completeness, my articles, grade status
- Editor dashboard: queue, assignments, decisions
- Committee dashboard: grade apps/nominations

---

## 14) Operational policies (must ship as pages)

- Editorial policy
- Membership grades & criteria
- Code of Conduct
- Retraction/correction policy
- Privacy/Terms

---

## 15) Backlog (editable)

### 15.1 Now (next milestones)

- [ ] Confirm Fellow is nomination-only (default yes)
- [ ] Finalize taxonomy v1 (topics + expertise)
- [ ] Implement article workflow FSM + tests
- [ ] Implement editorial dashboard + tests
- [ ] Implement Senior application flow + tests
- [ ] Implement Fellow nomination flow + tests
- [ ] Implement RLS policies + automated RLS tests

### 15.2 Later

- Issues/collections
- ORCID import
- Better citation parsing
- Analytics dashboards

---

## 16) Decision log (keep updated)

| Date       | Decision | Notes   |
| ---------- | -------- | ------- |
| YYYY-MM-DD | Example  | Example |

---

## 17) Open questions (track here)

- Q1:
- Q2:

---

## 18) Change log

- YYYY-MM-DD: Created living doc
