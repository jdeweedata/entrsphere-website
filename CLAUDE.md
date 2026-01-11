# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EntrSphere website - a landing page for a digital platform solutions company. Built with Next.js App Router, deployed on Vercel, with Convex for real-time data and Appwrite for authentication.

## Development Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Convex (real-time database), Appwrite (auth)
- **Icons**: Phosphor Icons
- **State**: TanStack React Query + React Context (AuthContext)
- **Forms**: React Hook Form + Zod validation
- **Analytics**: PostHog

## Architecture

### Path Aliases

Use `@/` prefix for imports (maps to `./src/`):
```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
```

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Homepage
│   ├── about/              # About page
│   ├── blog/               # Blog pages (dynamic)
│   ├── contact/            # Contact page
│   ├── dashboard/          # Admin dashboard
│   ├── discovery/          # Discovery agent
│   ├── login/              # Login page
│   ├── register/           # Register page
│   └── solutions/          # Solution pages
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── forms/              # Form components
│   ├── auth/               # Auth components
│   ├── admin/              # Admin components
│   └── discovery/          # Discovery agent components
├── contexts/               # React contexts
├── hooks/                  # Custom hooks
├── lib/                    # Utilities
├── services/               # API services
├── styles/                 # Global styles
└── types/                  # TypeScript types
```

### Server vs Client Components

- Pages in `src/app/` are Server Components by default
- Client components use `"use client"` directive at top
- Components using hooks, state, or browser APIs must be client components
- Convex queries/mutations require client components

### Environment Variables

Use `NEXT_PUBLIC_` prefix for client-side env vars:
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_POSTHOG_API_KEY` - PostHog analytics key
- `NEXT_PUBLIC_API_URL` - API base URL

### Dynamic Pages

Pages using Convex must export `dynamic = "force-dynamic"`:
- `/blog`, `/blog/[slug]` - Blog with Convex queries
- `/contact` - Contact form with Convex mutations
- `/dashboard` - Admin dashboard
- `/discovery` - Discovery agent

## Auth Flow

- `AuthProvider` wraps app in `providers.tsx`
- `useAuth()` hook for auth state and actions
- Appwrite handles authentication
- Admin check: email `admin@entrsphere.com`

## Adding shadcn Components

```bash
npx shadcn@latest add [component-name]
```

Components are added to `src/components/ui/`.

## Old Files (Can Be Removed)

The following directories contain old Vite code and can be deleted:
- `src/pages-old/` - Old Vite route pages
- `src/App.tsx` - Old Vite app entry
- `src/main.tsx` - Old Vite entry point
- `api-old/` - Old Vercel API functions
- `vite.config.ts` - Old Vite config
- `index.html` - Old Vite HTML entry
