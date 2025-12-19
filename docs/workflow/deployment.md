# Deployment (Vercel + Supabase)

## Vercel

1. Import the GitHub repository into Vercel.
2. Set environment variables in the Vercel project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Optional server-only) `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy the `main` branch.

## Supabase Auth settings

For email confirmation and OAuth redirects to work reliably, ensure Supabase Auth is configured to
match the Vercel deployment URL.

- Auth: set the **Site URL** to the production Vercel URL.
- Auth: add **Redirect URLs** for:
  - the production URL
  - preview URLs (if you want preview sign-in to work)

## Smoke checks

After deploying:

- Visit `/` and confirm the profile renders
- Visit `/login` and confirm the login page loads (it should show an env warning if Supabase env vars are missing)
- Visit `/membership-grades` and confirm the criteria page renders
- Apply SQL migrations in `supabase/migrations/` before using `/membership/apply`, `/profile/edit`, or `/articles`
