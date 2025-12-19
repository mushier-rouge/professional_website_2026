# Articles Management - Feature Expectations

## Scope
Articles management covers creating, listing, reading, editing, and deleting articles authored by signed-in users.

## User Flows
- Create article: /articles/new -> submit -> redirect to /articles/[id].
- Read article: /articles/[id] -> view title, summary, author, timestamps.
- Edit article: /articles/[id]/edit -> update fields -> confirmation state.
- List articles: /articles (and home page) -> show latest articles.

## Required Data Fields
- title (required, 5-160 chars)
- summary (optional, 0-1000 chars)
- external_url (optional, valid https URL if present)
- author_user_id (system-managed)
- created_at / updated_at (system-managed)

## UI Surfaces
- /articles
  - List cards with title, summary, author, created_at.
  - Empty state when no articles exist.
- /articles/new
  - Form fields: title (required), summary (optional), external_url (optional).
- /articles/[id]
  - Article details and author card.
- /articles/[id]/edit
  - Same fields as create, with delete action if supported.
- / (home)
  - Show recent articles with pagination or "load more" behavior.

## Permissions and Visibility
- Authenticated users can read articles.
- Only the author can edit or delete their article.
- Drafts are out of scope for now; create publishes immediately.

## Validation and Error States
- Block submit when title is missing or too long.
- Show inline validation for invalid URLs.
- Handle missing article id with a 404 state.
- Graceful error if Supabase is not configured.

## Acceptance Criteria
- A signed-in user can create, view, and edit their own article.
- A signed-in user cannot edit another author's article.
- The home page shows recent articles for signed-in users.
- Article list renders empty-state messaging when no data exists.

## Testing Expectations
- Unit tests for validation logic and server actions.
- Integration test for article create/update with Supabase client mocks.
- E2E test for create -> view -> edit flow.
