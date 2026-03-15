# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

EntrSphere is an AI-native development consultancy website with a flagship **Discovery Router** product — an AI agent that turns vague project ideas into actionable SPEC documents. The site serves as both a marketing/sales funnel and the product delivery platform.

**Primary goal**: Convert visitors into paying Discovery Toolkit customers (R2,500/session).

## Project Tree

```
entrsphere.com/
├── CLAUDE.md                  # THIS FILE — read first every session
├── context/                   # Layer 3: Training materials & learnings
│   ├── brand-voice.md         # Tone, copy standards, approved messaging
│   ├── tech-standards.md      # Code patterns, conventions, gotchas
│   └── product-knowledge.md   # Discovery Router features, pricing, flows
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Homepage (marketing landing)
│   │   ├── about/             # Company story
│   │   ├── blog/              # Content marketing (Convex-powered)
│   │   ├── case-studies/      # Social proof
│   │   ├── contact/           # Lead capture (Convex mutation)
│   │   ├── dashboard/         # Admin panel
│   │   ├── discovery/         # Discovery Agent (free tier)
│   │   ├── login/ & register/ # Auth pages (Appwrite)
│   │   ├── outcome/[token]/   # Shareable outcome pages
│   │   ├── payment/           # PayFast success/cancel flows
│   │   ├── solutions/         # Product pages
│   │   │   ├── discovery-router/    # Flagship product
│   │   │   ├── consulting/          # Service offering
│   │   │   └── product-requirements/# PRD service
│   │   └── waitlist/          # Pre-launch capture
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui primitives
│   │   ├── forms/             # Form components
│   │   ├── auth/              # Auth components
│   │   ├── admin/             # Admin components
│   │   └── discovery/         # Discovery agent UI
│   ├── contexts/              # React contexts (AuthContext)
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities (cn, etc.)
│   ├── services/              # API service layer
│   ├── styles/                # Global CSS
│   └── types/                 # TypeScript types
├── convex/                    # Backend: schema, mutations, queries
├── discovery-fs/              # Filesystem agent context
│   ├── playbooks/             # Route A-D guides
│   ├── templates/             # SPEC schema, questions
│   ├── knowledge/             # Red flags, scope creep signals
│   └── patterns/              # Route distribution data
├── docs/                      # Strategy docs, marketing copy, research
├── assets/                    # Design assets (reference + source)
└── specs/                     # Technical specifications
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Convex (real-time database), Appwrite (auth)
- **Payments**: PayFast (primary, ZAR), Paystack (legacy)
- **AI**: Anthropic Claude API (Haiku for previews, Sonnet for chat/SPEC)
- **Icons**: Phosphor Icons
- **State**: TanStack React Query + React Context (AuthContext)
- **Forms**: React Hook Form + Zod validation
- **Analytics**: PostHog
- **Email**: Resend
- **Deploy**: Vercel (auto-deploy on push to main)

## Rules

### Code Standards
- Use `@/` prefix for all imports (maps to `./src/`)
- Pages in `src/app/` are Server Components by default
- Client components must have `"use client"` at top
- Convex queries/mutations require client components
- Pages using Convex must export `dynamic = "force-dynamic"`
- Use `npm run dev:memory` to start dev server (avoids heap errors)
- Use `npm run type-check:memory` to check types (avoids heap errors)
- Add shadcn components via: `npx shadcn@latest add [name]` (goes to `src/components/ui/`)

### Environment Variables
- Client-side vars use `NEXT_PUBLIC_` prefix
- Required: `NEXT_PUBLIC_CONVEX_URL`, `ANTHROPIC_API_KEY`
- Optional: `NEXT_PUBLIC_POSTHOG_API_KEY`, `RESEND_API_KEY`
- Payments: `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`
- Never commit `.env.local` — use `.env.example` as reference

### Auth Flow
- `AuthProvider` wraps app in `providers.tsx`
- `useAuth()` hook for auth state and actions
- Admin check: email `admin@entrsphere.com`

### Business Rules
- Every feature must ladder to revenue (R150K/month goal)
- Discovery Router is the flagship — protect its UX above all
- SA market first: ZAR pricing, PayFast payments, WhatsApp-friendly
- Ship fast, validate with real users before polishing

### Old Files (Safe to Remove)
- `src/pages-old/`, `src/App.tsx`, `src/main.tsx` — old Vite code
- `api-old/` — old Vercel API functions
- `vite.config.ts`, `index.html` — old Vite config

## Note-Taking Protocol

After completing work in this project, add a dated one-liner to the relevant `context/*.md` file under its **Session Learnings** section. Format:

```
- [observation or preference learned] (learned YYYY-MM-DD)
```

When 3+ related learnings accumulate, graduate them into a new context file.

Always read `context/` files at session start to build on prior learnings.
