# Profile Management - Feature Expectations

## Scope
Profile management provides a CV-like member profile, privacy controls, and membership grade display.

## Feature set (v1)
- Create profile on first login (profile row created on save).
- Edit profile details and publish updates.
- Public profile page with credibility-first metadata.
- Member directory listing with grade badge and primary details.
- Visibility controls: public / unlisted / private.
- Directory opt-out toggle.
- Verification badges (email verified, ORCID connected, manual).
- Membership grade badge shown in profile header and directory cards.

## Profile data model
### Public fields
- Display name (required)
- Headshot/avatar
- Title/role
- Affiliation
- Location (city/country)
- Short bio + long bio
- Expertise tags (controlled taxonomy)
- Links: website, GitHub, LinkedIn, Google Scholar, ORCID
- Selected work (curated list)
- Membership grade badge + awarded date

### Private fields
- Email
- Phone (optional)
- Admin notes / moderation flags
- Verification artifacts (if used)

## User flows
- First login -> prompt to complete profile -> save -> redirect to account/profile.
- Edit profile -> validate fields -> save -> confirmation state.
- Public profile view -> shows badge, links, selected work, authored articles.
- Directory browse -> filter by grade/expertise -> click to profile.

## Permissions and privacy
- Users can edit only their own profile.
- Public profiles are readable by anyone.
- Unlisted profiles accessible via direct link only (not in directory).
- Private profiles visible only to the owner and admins.

## Validation and error states
- Block save if display name is empty or over 120 characters.
- Validate URL fields (https only).
- Show inline error messages for invalid input.
- If Supabase is not configured, show a clear warning.
- If user is signed out, redirect to /login.

## Acceptance criteria
- Signed-in users can create and edit their profile.
- Public profiles are visible to anonymous visitors.
- Directory respects visibility + opt-out settings.
- Membership grade badge displays consistently.

## Testing expectations
- Unit tests for validation and slug normalization.
- Integration tests for profile CRUD with Supabase mocks.
- E2E tests for create/edit profile flows.
- RLS tests for owner-only updates and public reads.
