# Product Requirements + Technical Spec

Status: Active
Current focus: Profile management and article management. Forum/discussion is deferred.

# 1) Product vision and positioning

## 1.1 Purpose

Build an IEEE/BCS-style professional society website for AI/ML experts that combines:

- Membership grades (Member / Senior Member / Fellow) with a credible upgrade process
- Member profiles with CV-like credibility signals (ORCID, Scholar, publications)
- Journal-like article publishing with editorial workflow (draft -> review -> publish)
- Governance and trust: policies, disclosures, review labels, audit trails

## 1.2 Target users

- Members: AI/ML practitioners, researchers, engineers
- Senior/Fellow candidates: recognized contributors
- Editors/Reviewers: appointed members who manage quality
- Public readers: browse articles and members; limited interaction unless logged in

## 1.3 Success criteria (measurable)

- Visitors can browse articles and profiles without friction
- Members can create and publish content through a structured workflow
- Membership grade upgrades have clear criteria, traceability, and integrity
- The site feels society/journal-like: consistent taxonomy, citations, disclosures, archival URLs

# 2) Site map and primary navigation

## 2.1 Public (no login)

- Home
- Articles
  - Browse (filters, search)
  - Article detail page
  - Issues / Collections (optional for v1 but recommended)
- Members
  - Member directory (filters, search)
  - Profile detail page
- About
  - Mission
  - Editorial policy
  - Membership grades and criteria
  - Code of Conduct
  - Governance / Committees
  - Privacy policy / Terms
- Apply / Join (signup)
- Login

## 2.2 Logged-in member

- Dashboard
  - My profile completeness + verification status
  - My articles (drafts, submissions, published)
  - My membership grade + upgrade status
- Write / Submit article
- Upgrade membership grade (Senior/Fellow)
- Account settings

## 2.3 Editorial staff

- Editorial dashboard
  - Submission queue
  - Assign reviewers
  - Decisions and revision cycles
  - Publish scheduling
  - Article audits (disclosures, plagiarism checks if used)
- Reviewer dashboard
  - Assigned reviews
  - Review forms
  - Deadlines (optional; no need to promise scheduling)

## 2.4 Admin (superuser)

- User management (roles, bans, flags)
- Membership upgrade management
- Taxonomy management (topics, tags, expertise)
- Site settings
- Audit logs
- Moderation

# 3) Roles, permissions, and governance

## 3.1 User roles (RBAC)

Implement as a formal RBAC model (roles + permissions), not ad-hoc checks.

### Roles

- Public: read public content
- Member: base authenticated user
- Senior Member: same as Member + prestige + can endorse/nominate (recommended)
- Fellow: same as Senior + prestige + can endorse/nominate (recommended)
- Reviewer: can review assigned submissions
- Editor: can manage editorial workflow for articles
- Admin: full access

### Permission examples (non-exhaustive)

- Create/edit own profile: Member+
- Create draft article: Member+
- Submit article for editorial review: Member+
- Edit article after submission: only in allowed states (see workflow)
- Review article: Reviewer (assigned only)
- Assign reviewer / change state: Editor+
- Publish: Editor+ (or Editor with Admin approval toggle)
- Approve grade upgrades: Grade Committee role (can be Editor or separate Committee role)

Implementation note: Use fine-grained permissions like:

- article.create, article.edit_own, article.submit, article.publish
- review.create_assigned, review.view_assigned
- grade.endorse, grade.nominate, grade.approve
- taxonomy.manage, user.manage, audit.view

## 3.2 Committees (recommended structure)

Model committees even if initially it maps to roles:

- Editorial Board (Editors)
- Membership Committee (handles Senior/Fellow)
- Fellows Committee (handles Fellow nominations)

Keep committee pages public for credibility (names optional if privacy desired).

# 4) Membership grades (Member / Senior Member / Fellow)

## 4.1 Grade definitions (site-specific)

You are not copying IEEE policy verbatim; you are implementing society-grade style.

### Grade: Member (default)

- Email verified
- Agrees to code of conduct
- Profile minimum completeness threshold (optional but recommended)

### Grade: Senior Member

- Application-based
- Must provide evidence of sustained contributions
- Requires endorsements (recommended: 2 endorsers, at least 1 Senior/Fellow)

### Grade: Fellow

- Nomination-based (not self-apply, optional toggle)
- Requires multiple endorsers (recommended: 3)
- Requires committee review and recorded vote/decision

## 4.2 Grade upgrade workflows

### A) Senior Member workflow

1. Member clicks Apply for Senior Member
2. System checks eligibility gates (configurable):
   - Profile completeness >= X%
   - Verified identity (optional: ORCID verified)
   - Minimum time since joining (optional)
3. Applicant fills structured form:
   - Summary of contributions (narrative)
   - Evidence list (publications, patents, OSS, leadership, deployed systems)
   - Years of experience (optional; do not require if you want alternative evidence)
   - Up to N supporting links
4. Applicant invites endorsers:
   - Enforcer: endorsers must have accounts
   - Endorser completes structured endorsement form
5. Membership Committee reviews:
   - Decision: approve / request more info / reject
   - Reasons recorded (private)
6. If approved:
   - Grade changes immediately
   - Badge appears on profile and article bylines
   - Public Grade awarded date shown (optional)

### B) Fellow workflow

Two modes (choose one; both supported by configuration):

Mode 1: Nomination-only

1. Senior/Fellow nominates a candidate (must have account)
2. Nominator completes nomination form + evidence
3. Candidate accepts nomination (consent step)
4. Nominator invites additional endorsers
5. Fellows Committee review:
   - Panel scoring rubric + meeting notes
   - Decision recorded + effective date
6. Award Fellow

Mode 2: Apply + nomination hybrid

Allow a candidate to submit intent to be considered but still require nomination step.

## 4.3 Evidence types (normalize for consistent review)

Implement evidence entries as a structured list:

- Evidence category (Publication / OSS / Product / Leadership / Teaching / Standards / Patents / Awards / Community)
- Title
- Description (short)
- Link(s)
- Date range
- Role/contribution statement
- Optional: verification status flag (manual)

## 4.4 Grade badges and display rules

- Visible badge on:
  - Profile header
  - Article byline (each author)
  - Member directory cards
- Badge tooltip:
  - Grade explanation
  - Award date
  - Link: How grades work
- Optional: show Committee-approved tag for Senior/Fellow

## 4.5 Endorsements and conflict-of-interest

Endorsement forms include:

- Relationship to candidate (colleague, collaborator, manager, etc.)
- Conflict disclosure checkbox
- Free-text endorsement (min length)
- Option to mark endorsement private to committee (recommended: always private)

Committee interface should highlight:

- Prior co-authorship? (optional integration)
- Shared affiliation? (manual entry)

# 5) Member profiles (IEEE/BCS-style)

## 5.1 Profile data model (public + private)

### Public fields

- Full name
- Preferred name (optional)
- Headshot/avatar
- Current title/role
- Affiliation (organization; optional if independent)
- Location (city/country; optional)
- Bio (short + long)
- Expertise areas (from controlled taxonomy)
- Keywords (limited free-text)
- Links: personal website, GitHub, LinkedIn, Google Scholar, ORCID
- Selected Work list (curated by user)
- Publications list (manual or imported; optional)
- Membership grade badge + awarded date (optional)
- Committees/roles (if you want transparency)

### Private fields

- Email
- Phone (optional)
- Mailing address (optional)
- Identity verification artifacts (optional)
- Admin notes
- Moderation flags

## 5.2 Profile verification (optional but recommended)

Implement verification badges distinct from membership grade:

- ORCID connected (OAuth)
- Email domain verified (if affiliation email)
- Manual verification (admin)

Do not mix verification with grade.

## 5.3 Member directory

Features:

- Search by name, affiliation, keywords
- Filters:
  - Grade (Member/Senior/Fellow)
  - Expertise tags/topics
  - Country/region (optional)
  - Has publications, Has GitHub, etc. (optional)
- Sort:
  - Relevance (search)
  - Recently active (optional)
  - Grade then name (default browsing)

Privacy control:

- Allow members to hide from directory (opt-out), while keeping profile accessible via direct link if desired.

## 5.4 Selected work & publications

Two lists:

- Selected Work: curated links with short descriptions (MVP)
- Publications: structured entries (optional in v1)
  - Title, authors, venue, year, DOI/arXiv, link
  - Option to import from ORCID later

# 6) Article management (journal-style CMS + editorial workflow)

## 6.1 Content types

- Article (general)
- Tutorial
- Survey
- Perspective/Commentary
- Practice Note (engineering / reproducibility)
- Editorial (board posts)
- Announcement (calls, elections, etc.)

Each content type can share a common schema with small variations.

## 6.2 Article schema (canonical)

- Title
- Subtitle (optional)
- Authors (linked to member profiles; allow external authors but mark as Guest Author)
- Abstract (required)
- Keywords (controlled + limited free-text)
- Topics/tags (controlled taxonomy)
- Body content (Markdown or rich text with structured sections)
- Figures / tables (assets with captions)
- References (structured list + BibTeX export)
- Disclosures:
  - Funding
  - Conflicts of interest
  - Ethical considerations (optional)
- Reproducibility panel:
  - Code links + license
  - Data links + license
  - Compute/training notes
  - Evaluation details
- Article metadata:
  - Status (workflow state)
  - Submitted date, accepted date, published date
  - Version number / revision history
  - Editor assigned
  - Reviewer assignments
  - DOI-like internal identifier (slug + stable ID)
  - Cite this page data

## 6.3 Article workflow states (finite-state machine)

Recommended states:

- DRAFT (author editable)
- SUBMITTED (locked except minor metadata; editor triage)
- DESK_REJECTED (final; with reasons)
- IN_REVIEW (reviewers assigned; author locked)
- REVISION_REQUESTED (author edits allowed)
- RESUBMITTED (back to editor/reviewers)
- ACCEPTED (copy-edit stage)
- SCHEDULED (publish date set)
- PUBLISHED (public)
- ARCHIVED (public but marked outdated)
- RETRACTED (public page remains with retraction notice; body hidden)

State transition rules must be explicit and enforced by backend.

## 6.4 Editorial operations

- Desk triage: accept to review / desk reject / request scope changes
- Assign editor (if not default)
- Assign reviewers (N reviewers)
- Reviewer reminders (optional)
- Decision templates:
  - Accept
  - Minor revision
  - Major revision
  - Reject
- Copy-edit checklist:
  - Formatting and references
  - Disclosures present
  - Image credits
  - Plagiarism check status (if used)
- Publish controls:
  - Publish immediately or schedule
  - Feature on homepage / issue
  - Pin/spotlight

## 6.5 Reviewer workflow

- Reviewer sees assigned submissions
- Review form structure:
  - Summary
  - Strengths
  - Weaknesses / concerns
  - Required changes
  - Ethical issues
  - Recommendation (accept/minor/major/reject)
  - Confidential comments to editor
- Reviewer identity model (configurable):
  - Single-blind (reviewer hidden from author, editor known)
  - Open review (reviewer optionally public)
  Keep this configurable per article type.

## 6.6 Authoring experience

- Editor supports:
  - Markdown with section templates (Abstract, Intro, Methods...)
  - Citation helper (paste DOI/arXiv; agent can implement later)
- Live preview in IEEE-like layout
- Asset manager for figures with captions
- Reference manager:
  - Manual entry + paste BibTeX
  - Export BibTeX/APA for Cite this article

## 6.7 Public article pages (IEEE-like)

Layout features:

- Top metadata block:
  - Title, authors, affiliations
  - Grade badges on authors
  - Published date, last updated date
  - Reviewed by editorial board label + editor name (optional)
- Abstract box
- Table of contents (auto from headings)
- Figures with captions
- References at bottom
- Cite this (copy BibTeX / APA)
- Related articles (by tags/topics)
- Version history link (optional)
- Disclosure panel (always visible, even if empty with No disclosures reported)

# 7) Issues / Collections (highly recommended)

## 7.1 Purpose

Give the site an IEEE-journal feel via curated Issues even if you publish continuously.

## 7.2 Collection types

- Monthly issue (Vol X, Issue Y)
- Special issue / theme collection
- Conference highlights
- Editorial picks

## 7.3 Collection features

- Collection landing page
- Ordered list of articles
- Guest editors (optional)
- Collection citation

# 8) Taxonomy and controlled vocabularies

## 8.1 Why controlled taxonomy matters

Avoid tag chaos. Implement:

- Topics (hierarchical): Machine Learning -> Deep Learning -> LLMs
- Keywords (flat; limited)
- Expertise tags (for profiles; can map to topics)

## 8.2 Admin taxonomy tools

- Create/edit topics
- Merge tags
- Deprecate tags (keep for legacy mapping)
- Synonyms (search normalization)

# 9) Moderation, trust, and safety

## 9.1 Code of Conduct enforcement

- Report button on:
  - Profiles
  - Articles
- Report types:
  - Harassment
  - Fraudulent claims
  - Plagiarism
  - Copyright
  - Spam
- Admin review queue for reports
- Actions:
  - Warn user
  - Hide content
  - Suspend account
  - Retraction workflow for articles

## 9.2 Integrity controls

- Audit logs for:
  - Role changes
  - Grade changes
  - Article state changes
  - Reviewer assignments
- Immutable log storage (append-only) preferred

## 9.3 Copyright and licensing

- Require authors to select a license for original content:
  - All rights reserved
  - CC BY / CC BY-NC
- Require explicit confirmations:
  - I have rights to publish this
  - Figures are credited
- For external summaries, enforce quoting limits and link to sources

# 10) System architecture (recommended)

## 10.1 Tech stack (one pragmatic option)

- Frontend: Next.js (SSR/ISR for SEO), TypeScript
- Backend: NestJS or FastAPI (or Next.js API routes if small)
- Database: PostgreSQL
- Search: Meilisearch (simple) or Elasticsearch/OpenSearch (advanced)
- Cache: Redis (sessions, rate limits, queues)
- File storage: S3-compatible (AWS S3 / Cloudflare R2)
- Auth: NextAuth/Auth.js or custom JWT + refresh tokens
- Email: Postmark/SendGrid/Mailgun
- Observability: Sentry + OpenTelemetry + Grafana/Datadog (any)

This is not the only stack; the key is SSR + robust RBAC + Postgres.

## 10.2 Deployment

- Dockerized services
- Environment separation: dev / staging / production
- CI/CD with migrations
- Infrastructure as code (Terraform optional)

# 11) Database schema (implementation-level)

Below is a concrete schema outline (agent can translate to ORM models/migrations).

## 11.1 Users and profiles

users

- id (uuid)
- email (unique)
- email_verified_at
- password_hash (if not SSO)
- status (active/suspended/deleted)
- created_at, updated_at, last_login_at

member_profiles

- user_id (pk, fk users.id)
- full_name
- preferred_name
- headline_title
- affiliation
- location
- bio_short
- bio_long
- avatar_asset_id (fk assets.id)
- website_url, github_url, linkedin_url, scholar_url, orcid_url
- visibility (public/unlisted/private)
- directory_opt_out (bool)
- profile_completeness_score (int)
- created_at, updated_at

profile_expertise

- user_id
- topic_id (or tag_id)
- level (optional)
- primary (bool)

## 11.2 Roles and permissions

roles

- id
- name (member, senior_member, fellow, reviewer, editor, admin, committee_member, etc.)

permissions

- id
- key (e.g., article.publish)
- description

role_permissions

- role_id
- permission_id

user_roles

- user_id
- role_id
- granted_by
- granted_at

## 11.3 Membership grades

If you treat grade as distinct from role (recommended):

membership_grades

- id
- key (member/senior/fellow)
- name
- description
- badge_asset_id

user_grade

- user_id (pk)
- grade_id
- awarded_at
- awarded_by
- revoked_at (nullable)
- notes_private

## 11.4 Grade applications and endorsements

grade_applications

- id
- user_id (candidate)
- target_grade_id
- status (draft/submitted/in_review/needs_info/approved/rejected/withdrawn)
- narrative (text)
- submitted_at
- decided_at
- decided_by
- decision_notes_private

grade_evidence

- id
- application_id
- category
- title
- description
- url
- date_start, date_end
- contribution_role
- verification_status (unverified/verified)

grade_endorsements

- id
- application_id
- endorser_user_id
- relationship
- conflict_disclosed (bool)
- endorsement_text
- submitted_at
- visibility (committee_only)

fellow_nominations (if nomination-only)

- id
- nominee_user_id
- nominator_user_id
- status
- nomination_text
- created_at

committee_votes (optional but strong)

- id
- application_id
- committee_user_id
- vote (approve/reject/abstain)
- note
- created_at

## 11.5 Articles

articles

- id
- type (article/tutorial/survey/etc.)
- slug (unique)
- title
- subtitle
- abstract
- status (enum workflow)
- created_by_user_id
- assigned_editor_user_id
- submitted_at
- accepted_at
- published_at
- scheduled_publish_at
- updated_at
- featured_rank (int nullable)
- issue_id (nullable)
- disclosure_funding
- disclosure_conflicts
- disclosure_ethics
- license_key
- reading_time_estimate

article_authors

- article_id
- user_id (nullable for guest)
- guest_name (nullable)
- guest_affiliation (nullable)
- author_order

article_revisions

- id
- article_id
- revision_number
- body_markdown (or richtext JSON)
- change_summary
- created_by
- created_at

article_assets

- id
- article_id
- asset_id
- caption
- credit

article_references

- id
- article_id
- ref_type (doi/arxiv/url/bibtex)
- citation_text (formatted)
- doi
- url
- bibtex_raw
- sort_order

## 11.6 Reviews

review_assignments

- id
- article_id
- reviewer_user_id
- assigned_by
- assigned_at
- due_at (optional)
- status (assigned/submitted/declined)

reviews

- id
- article_id
- reviewer_user_id
- recommendation
- summary
- strengths
- weaknesses
- required_changes
- ethics_notes
- confidential_to_editor
- submitted_at

editor_decisions

- id
- article_id
- editor_user_id
- decision (desk_reject/major/minor/accept/reject)
- letter_to_author
- created_at

## 11.7 Assets and audit

assets

- id
- type (image/pdf/etc.)
- storage_key
- mime_type
- size
- uploaded_by
- created_at

audit_logs

- id
- actor_user_id
- action_key
- entity_type
- entity_id
- before_json
- after_json
- created_at
- ip_address (optional)

# 12) API endpoints (agent-ready outline)

Prefix: /api/v1

## 12.1 Auth

- POST /auth/signup
- POST /auth/login
- POST /auth/logout
- POST /auth/verify-email
- POST /auth/reset-password
- GET /auth/me

## 12.2 Profiles

- GET /members (search + filters)
- GET /members/:slugOrId
- PATCH /me/profile
- POST /me/profile/avatar
- POST /me/profile/selected-work
- DELETE /me/profile/selected-work/:id

## 12.3 Membership grades

- GET /grades (public)
- GET /me/grade
- POST /grades/senior/apply
- POST /grades/applications/:id/submit
- POST /grades/applications/:id/evidence
- POST /grades/applications/:id/endorse (endorser)
- GET /admin/grades/applications (committee)
- POST /admin/grades/applications/:id/decision

For Fellow nomination:

- POST /grades/fellow/nominate
- POST /grades/fellow/nominations/:id/accept

## 12.4 Articles (public)

- GET /articles (filters/search)
- GET /articles/:slug
- GET /issues
- GET /issues/:id

## 12.5 Articles (member)

- POST /me/articles (create draft)
- PATCH /me/articles/:id (edit draft metadata)
- POST /me/articles/:id/revisions (save body)
- POST /me/articles/:id/submit

## 12.6 Editorial

- GET /editor/submissions
- POST /editor/articles/:id/assign-reviewer
- POST /editor/articles/:id/decision
- POST /editor/articles/:id/request-revision
- POST /editor/articles/:id/publish
- POST /editor/articles/:id/schedule

## 12.7 Reviews

- GET /reviewer/assignments
- POST /reviewer/articles/:id/review

## 12.8 Taxonomy/admin

- GET /topics
- POST /admin/topics
- PATCH /admin/topics/:id
- POST /admin/topics/:id/merge

# 13) Search and indexing

## 13.1 Index targets

- Articles: title, abstract, body headings, tags, authors
- Members: name, affiliation, expertise tags, bio short

## 13.2 Ranking rules (simple, effective)

Articles:

- Exact title match boosted
- Tag/topic match boosted
- Newer + featured boosted (configurable)

Members:

- Name match highest
- Grade boost (Fellow > Senior > Member)

## 13.3 Synonyms and normalization

- Map LLM, Large Language Models
- RLHF, alignment, etc.
Implement synonyms at the search layer.

# 14) UX specs (screens + components)

## 14.1 Home

- Hero: mission + join CTA
- Featured articles carousel/grid (editor picks)
- Latest issue / collection section
- Meet the Fellows highlight strip (optional)
- Search bar prominent

## 14.2 Articles browse

- Left filter panel (desktop), drawer (mobile)
- Sort: latest / featured / most cited (future) / most discussed (future)
- Cards show:
  - Type badge
  - Title
  - Abstract snippet
  - Author badges
  - Published date
  - Topics/tags chips

## 14.3 Article page (IEEE-style)

- Clean typographic hierarchy
- Abstract callout box
- Sticky TOC
- Cite this button (BibTeX modal)
- Disclosures panel
- Version history link
- Related articles

## 14.4 Member directory

- Search
- Filters (grade, expertise)
- Cards:
  - Avatar
  - Name
  - Grade badge
  - Affiliation
  - Top 3 expertise tags

## 14.5 Member profile page

- Header with badge
- Links row (Scholar/ORCID/GitHub)
- Bio
- Expertise tags
- Selected work list (with previews if possible)
- Articles authored list

## 14.6 Dashboard

- Profile completeness checklist
- My grade + apply/nominate status
- My articles
- Notifications

## 14.7 Senior application form

- Multi-step wizard:
  - Summary
  - Evidence entries
  - Endorsers invite
  - Review and submit

## 14.8 Fellow nomination flow

- Nominator form
- Candidate acceptance screen
- Endorser flow
- Committee panel with scoring rubric

## 14.9 Editorial dashboard

- Queue with status filters
- Assign reviewers modal
- Decision letter templates
- Revision comparison (diff between revisions)

# 15) IEEE-like design system

## 15.1 Visual language

- Neutral, academic palette
- Serif headings + sans body OR consistent professional sans with print-like spacing
- Narrow reading column with generous margins
- Section numbering option (I, II, III) as a style toggle

## 15.2 Components

- Badge component (grade + verification)
- Callout panels: Abstract, Disclosures, Repro Notes
- Citation modal (copy buttons)
- TOC component
- Figure component with caption and credit line

## 15.3 Accessibility

- WCAG AA targets
- Keyboard navigation for modals, TOC, filters
- Proper semantic headings for articles
- Alt text required for images in articles

# 16) Security, privacy, and compliance

## 16.1 Security baseline

- Rate limiting on auth endpoints
- CSRF protection (if cookie-based auth)
- Password policy and secure hashing (argon2/bcrypt)
- MFA optional (recommended for editors/admin)
- Role changes require admin + audit log
- Signed URLs for asset access (S3)

## 16.2 Privacy controls

- Profile visibility levels
- Directory opt-out
- Public email hidden by default
- GDPR-ish controls:
  - Export my data
  - Delete my account (soft delete + anonymize public content rules)

## 16.3 Auditability

- Every grade decision recorded
- Every article state change recorded
- Reviewer assignments recorded

# 17) Content operations (how you run it)

## 17.1 Editorial policy pages (public)

- What reviewed means on this site
- What conflicts must be disclosed
- What gets rejected (spam, plagiarism, etc.)
- Retraction and correction policy

## 17.2 Membership grade policy pages (public)

- Criteria per grade
- Process steps
- What endorsements mean
- Appeals process (optional)

## 17.3 Seed strategy (implementation detail)

- Invite initial Fellows/Seniors (manually assigned) to bootstrap credibility
- Publish 10-30 flagship articles to set quality bar

# 18) Testing and QA requirements

## 18.1 Automated tests

- Unit tests for workflow transitions
- RBAC permission tests
- API contract tests
- Search indexing tests (smoke)

## 18.2 Manual QA checklist (must pass)

- New user -> profile -> submit article -> revision -> published
- Senior application -> endorsements -> committee decision
- Fellow nomination -> acceptance -> endorsements -> committee vote
- Editor assignments + review submission path
- Directory filters and search relevance

# 19) Deliverables your agent must provide

## 19.1 Engineering deliverables

- Running production deployment
- DB migrations + seed scripts
- Admin bootstrap account creation
- Monitoring dashboards
- Backups strategy
- Documentation:
  - API docs
  - Admin runbook
  - Editorial runbook
  - Membership committee runbook

## 19.2 Product deliverables

- Final information architecture
- UI designs (Figma or equivalent)
- Copy for policy pages
- Controlled taxonomy initial set (topics, expertise tags)

# 20) Implementation phases (no time assumptions; just scope gates)

## Phase 1: Foundations

- Auth + profiles + directory (basic)
- RBAC
- Taxonomy
- Public pages + policies scaffold
- Assets upload

## Phase 2: Articles MVP

- Article editor (draft/revision)
- Submission workflow
- Editorial dashboard (triage + publish)
- Public article pages + citations

## Phase 3: Reviews

- Reviewer assignment + review forms
- Revision cycles + decision letters
- Reviewed labeling logic

## Phase 4: Membership grades

- Senior application + endorsements + committee decisions
- Fellow nomination + endorsements + vote/decision tooling
- Badges everywhere + audit logs

## Phase 5: Issues/Collections + polish

- Collections
- Featuring/pinning
- Better search ranking
- Analytics + reporting

# 21) Non-negotiable gotchas to specify to the agent

- Grade != Role: grades are recognition; roles are permissions. Keep them separate.
- Every decision needs an audit trail (especially grade changes and publishing).
- State machine enforcement: no ad-hoc transitions.
- Profile is CV-like, not social: avoid likes/following in v1.
- Public credibility pages (policy, criteria, governance) are part of the product.

# 22) Open decisions

- Fellow mode: nomination-only (recommended) vs apply + nomination hybrid.
- Review visibility: single-blind (recommended) vs open review.

If no decision is provided, implement both as site settings with defaults:
- Fellow mode = nomination-only
- Review visibility = single-blind
