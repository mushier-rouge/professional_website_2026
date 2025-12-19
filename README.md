Professional website and membership portal (Next.js + Supabase).

## Getting Started

### Environment

- Copy `.env.example` to `.env.local`
- Set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quality gates

- Full regression suite: `npm run test:all`
- Pre-commit hook runs `npm run test:all` (lint + unit + build + smoke)

## Deploy on Vercel

- Connect the GitHub repo in Vercel
- Set the same env vars in the Vercel project settings
