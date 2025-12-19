# Setup Guide

## Project Identifiers
- Vercel project name: professional-website-2026
- Vercel project id: prj_gYZXBMhbakXvQWowAzMFftO9iekE
- Vercel org id: team_05EdZs7YCIuV6IkzP5XQmOrX
- Supabase project name: professional_website_2026
- Supabase project ref: cgjzowzomduqwdxolcon
- Supabase DB password: dysban-6hesdi-xYwkuf

## Required Environment Variables (App)
| Name | Purpose | Value |
| --- | --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Supabase API base URL | https://cgjzowzomduqwdxolcon.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public anon key for client requests | Pending (retrieve from Supabase project settings) |
| SUPABASE_SERVICE_ROLE_KEY | Server-only service key | Pending (retrieve from Supabase project settings) |
| SUPABASE_STORAGE_BUCKET | Storage bucket for PDFs | TBD |

## CLI Authentication
| Tool | Env Var | Value |
| --- | --- | --- |
| Vercel CLI | VERCEL_TOKEN | Optional (using `vercel login`) |
| Supabase CLI | SUPABASE_ACCESS_TOKEN | Needed to link the project + push migrations |
