# Profile Management - Feature Expectations

## Scope
Profile management covers identity details, membership status, and profile editing for authenticated users.

## User Flows
- First login -> create profile if missing -> redirect to /profile/edit.
- Edit profile -> save -> confirmation state.
- View account summary -> /account shows session info and current membership grade.

## Required Data Fields
- display_name (required, 2-80 chars)
- linkedin_url (optional, must be valid https URL if present)
- avatar_url (optional, must be valid https URL if present)
- membership_grade (system-managed, default "member")

## UI Surfaces
- /account
  - Show email, user id, membership grade, and profile summary.
  - Include actions: Edit profile, Apply for membership upgrade.
- /profile/edit
  - Editable fields: display_name, linkedin_url, avatar_url.
  - Read-only membership grade indicator.

## Permissions and Privacy
- Users can only view or edit their own profile data.
- Profile fields are private by default until a public profile page is added.

## Validation and Error States
- Block save if display_name is empty or too long.
- Show inline validation for invalid URLs.
- If Supabase is not configured, show a clear configuration warning.
- If user is signed out, redirect to /login.

## Acceptance Criteria
- A signed-in user can create a profile on first login.
- A signed-in user can update their profile and see changes reflected on /account.
- A signed-out user cannot access /profile/edit.
- Membership grade is visible but not editable by the user.

## Testing Expectations
- Unit tests for input validation and normalization.
- E2E test for the create/edit profile flow.
- Authorization checks ensure a user cannot edit another user's profile.
