# Articles Management - Feature Expectations

## Scope
Articles management covers authoring, review workflow, publishing, and public article pages.

## Content types (v1)
- Article
- Tutorial
- Survey
- Perspective
- Practice Note
- Editorial

## Article schema (minimum)
- Title, subtitle
- Authors (linked to member profiles; guest author allowed)
- Abstract
- Topics/tags (controlled)
- Body content (Markdown/MDX)
- Figures/assets with captions + credits
- References (structured)
- Disclosures (funding, conflicts, ethics)
- Status + timestamps (submitted/accepted/published)

## Workflow states
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

## Authoring experience
- Create draft with title + abstract
- Edit draft content and metadata
- Attach figures/assets
- Submit for review (locks body in review states)
- View status and editorial feedback

## Editorial workflow
- Editor triage: accept to review or desk reject
- Assign reviewers
- Capture reviewer recommendations
- Decision letters (accept/minor/major/reject)
- Publish immediately or schedule

## Public article page (IEEE-style)
- Metadata block: title, authors, dates, badges
- Abstract callout panel
- Table of contents (auto from headings)
- Cite This panel (plain text + BibTeX)
- Disclosures panel (always visible)
- References list

## Permissions and visibility
- Public can read published articles.
- Authors can edit only their own drafts.
- Reviewers can access assigned submissions only.
- Editors can manage all submissions and publish.

## Validation and error states
- Title required (min length).
- Validate URL fields for external links.
- 404 for missing article IDs.
- Clear error if Supabase is not configured.

## Acceptance criteria
- Authors can create, edit, and submit drafts.
- Editors can transition workflow states.
- Public can read published articles without login.
- Article pages show abstract, cite-this, and disclosure panels.

## Testing expectations
- Unit tests for workflow state transitions.
- Integration tests for create/update with Supabase mocks.
- E2E test for create -> submit -> publish -> read.
- RLS tests for public reads + author-only edits.
