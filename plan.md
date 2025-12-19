# Project Plan

## Focus
Forum/discussion is deferred. Current focus is profile management and article management.

## Product Vision
Build an IEEE/BCS-style professional society site for AI/ML experts with memberships, credible profiles, and journal-style publishing.

## Phases

### Phase 1: Foundations
- Auth + profiles + member directory (basic)
- RBAC roles + permissions
- Taxonomy (topics, keywords, expertise)
- Public policy pages + governance scaffolding
- Asset uploads (avatars, article figures)

### Phase 2: Articles MVP
- Article editor (draft + revisions)
- Submission workflow
- Editorial dashboard (triage + publish)
- Public article pages + citations

### Phase 3: Reviews
- Reviewer assignment + review forms
- Revision cycles + decision letters
- Reviewed labeling logic

### Phase 4: Membership grades
- Senior application + endorsements + committee decisions
- Fellow nomination + endorsements + vote/decision tooling
- Badges everywhere + audit logs

### Phase 5: Issues/Collections + polish
- Collections
- Featuring/pinning
- Better search ranking
- Analytics + reporting

## Non-negotiables
- Grade != Role (grades are recognition, roles are permissions)
- Every grade/article decision has an audit trail
- State machine enforcement for article workflow
- Profile is CV-like, not social
- Public credibility pages are required

## Open Decisions (if unanswered, implement as site settings with defaults)
- Fellow mode: nomination-only (default) or apply + nomination hybrid
- Review visibility: single-blind (default) or open review
