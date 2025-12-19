# Setup Guide

## Project Identifiers
- Vercel project name: professional-website-2026
- Supabase project name: professional_website_2026
- Supabase project ref: cgjzowzomduqwdxolcon
- Supabase DB password: store in a password manager (do not commit to git)

## Required Environment Variables (App)
| Name | Purpose | Value |
| --- | --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Supabase API base URL | https://cgjzowzomduqwdxolcon.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public anon key for client requests | Set in `.env.local` / Vercel env |
| SUPABASE_SERVICE_ROLE_KEY | Server-only service key | Set in `.env.local` / Vercel env |
| SUPABASE_STORAGE_BUCKET | Storage bucket for PDFs | TBD |

## CLI Authentication
| Tool | Env Var | Value |
| --- | --- | --- |
| Vercel CLI | VERCEL_TOKEN | TBD |
| Supabase CLI | SUPABASE_ACCESS_TOKEN | TBD |
