# Technical Standards & Patterns
> Read this when: writing code, reviewing PRs, making architecture decisions, or debugging.

## Component Patterns

### New Page Checklist
1. Create `src/app/[route]/page.tsx`
2. Server Component by default; add `"use client"` only if needed
3. If using Convex: export `dynamic = "force-dynamic"`
4. Use `@/` imports, never relative paths crossing directories
5. Add to navigation if user-facing

### Component Structure
```typescript
// Client component template
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  // typed props
}

export function ComponentName({ ...props }: Props) {
  // hooks first
  // handlers
  // render
}
```

### Styling
- Tailwind utility classes, not custom CSS
- Use `cn()` from `@/lib/utils` for conditional classes
- shadcn/ui for all primitives (Button, Dialog, Toast, etc.)
- Phosphor Icons for iconography, Lucide as fallback
- Dark mode via `next-themes` — always test both modes

### API Routes (Next.js App Router)
- Place in `src/app/api/[route]/route.ts`
- Use `NextRequest`/`NextResponse` types
- Validate input with Zod schemas
- Never expose API keys in client code

### Convex Patterns
- Schema in `convex/schema.ts`
- Mutations/queries in feature-named files (`convex/discovery.ts`)
- Always use Convex client hooks in client components
- Deploy schema changes: `CONVEX_DEPLOYMENT="prod:small-sardine-868" npx convex deploy`

### Discovery Agent Architecture
- Filesystem-based context (not RAG)
- Agent tools: `list_directory`, `read_file`, `search_files`, `write_session`
- Context lives in `discovery-fs/`
- Model routing: Haiku for previews, Sonnet for full sessions
- Streaming responses via SSE

## Known Gotchas
- Heap errors on `npm run dev` and `tsc` — always use `:memory` variants
- Old Vite files still exist in repo — don't reference them
- Convex deployment ID is `prod:small-sardine-868`
- PayFast sandbox mode controlled by `PAYFAST_SANDBOX` env var

---

## Session Learnings
<!-- AI adds dated one-liners here after each session -->
