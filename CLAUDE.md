# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EntrSphere website - a landing page for a digital platform solutions company. Built with Lovable.dev and connects to Appwrite for backend services.

## Development Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Tech Stack

- **Framework**: React 18 + Vite (SWC compiler)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Appwrite (self-hosted at appwrite.entrsphere.com)
- **Routing**: React Router DOM
- **State**: TanStack React Query + React Context (AuthContext)
- **Forms**: React Hook Form + Zod validation

## Architecture

### Path Aliases

Use `@/` prefix for imports (maps to `./src/`):
```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
```

### Directory Structure

- `src/components/` - Page sections (HeroSection, FAQ, etc.) and reusable components
- `src/components/ui/` - shadcn/ui primitives (don't modify directly, use `npx shadcn@latest add`)
- `src/components/forms/` - Form-specific components
- `src/components/auth/` - Auth-related components (LoginForm, ProtectedRoute)
- `src/components/admin/` - Admin dashboard components
- `src/pages/` - Route pages (Index, Login, Register, Dashboard)
- `src/services/` - API layer (authService, betaSignupService)
- `src/contexts/` - React contexts (AuthContext)
- `src/hooks/` - Custom hooks
- `src/lib/` - Utilities and Appwrite client config

### Appwrite Integration

Appwrite client configured in `src/lib/appwrite.ts`:
- Database ID: `entrsphere_db`
- Collection: `beta_signups` for beta signup form submissions
- Auth via `account` export from appwrite.ts

### Auth Flow

- `AuthContext` wraps the app and provides `useAuth()` hook
- `authService.ts` handles login/register/logout/getCurrentUser
- Admin check: email `admin@entrsphere.com` or `admin` label

### Homepage Structure

The Index page composes these sections in order:
Header → HeroSection → SocialProof → ProblemsSection → SolutionsSection → Testimonials → BetaSignupForm → FAQ → Footer

## Adding shadcn Components

```bash
npx shadcn@latest add [component-name]
```

Components are added to `src/components/ui/` with the default style configuration.
