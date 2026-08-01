# Sun-Ray-Community

A Next.js (App Router, TypeScript) starter with Tailwind CSS, shadcn/ui, and
Supabase Auth wired up.

## What's here

- Public **Homepage** (`/`)
- **Sign up** (`/signup`), **Log in** (`/login`), **Log out**, **Forgot
  password** (`/forgot-password`) and **Reset password** (`/reset-password`)
  flows using Supabase Auth
- A protected **Dashboard** (`/dashboard`) that redirects unauthenticated
  visitors to `/login`
- Auth is enforced in `src/proxy.ts` (Next.js's middleware/proxy convention)
  and re-checked on the server in the dashboard page

No other features are implemented yet — this is just the auth skeleton and
page routing.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a [Supabase](https://supabase.com) project, then copy
   `.env.local.example` to `.env.local` and fill in your project's URL and
   anon key (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

3. In your Supabase project, under **Authentication → URL Configuration**,
   add your site URL (e.g. `http://localhost:3000`) as a redirect URL so the
   sign-up confirmation and password-reset email links work.

4. Run the dev server:

   ```bash
   npm run dev
   ```

## Project structure

- `src/app/page.tsx` — public homepage
- `src/app/(login|signup|forgot-password|reset-password)/page.tsx` — auth
  pages
- `src/app/auth/actions.ts` — server actions for login, signup, logout,
  password reset
- `src/app/auth/confirm/route.ts` — handles Supabase email confirmation /
  recovery links
- `src/app/dashboard/page.tsx` — protected page
- `src/lib/supabase/` — Supabase client helpers (browser, server, proxy)
- `src/proxy.ts` — refreshes the Supabase session and redirects
  unauthenticated users away from protected routes
- `src/components/ui/` — shadcn/ui components
