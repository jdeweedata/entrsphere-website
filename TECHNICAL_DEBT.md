# Technical Debt Analysis Report

**Generated:** 2026-02-07
**Project:** EntrSphere Website

## Summary

| Metric | Value |
|--------|-------|
| **Files Analyzed** | 176 |
| **Total Lines** | 22,099 |
| **Total Issues** | 334 |

### Issues by Severity

| Severity | Count |
|----------|-------|
| **HIGH** | 73 |
| **MEDIUM** | 82 |
| **LOW** | 179 |

### Dependencies

**Status:** Healthy
**Dependencies:** 60
**Dev Dependencies:** 10
**Issues:** 0

---

## Critical Findings

### 1. Large Files (5 files exceed 500 lines)

| File | Lines | Priority | Status |
|------|-------|----------|--------|
| `components/ui/sidebar.tsx` | 762 | Medium | Split into smaller components |
| `components/discovery/ToolkitSessionContent.tsx` | 756 | Medium | Extract sub-components |
| ~~`services/discoveryService.ts`~~ | ~~696~~ | ~~High~~ | **RESOLVED** - Split into `services/discovery/` module (2026-02-07) |
| ~~`pages-old/BlogPost.tsx`~~ | ~~604~~ | ~~Low~~ | **DELETED** - Legacy code removed |
| `app/api/discovery/agent/route.ts` | 556 | Medium | Extract helper functions |
| `components/BlogPostContent.tsx` | 540 | Medium | Split into sections |

### 2. BUG Comments (Investigated)

| Location | Line | Status |
|----------|------|--------|
| `lib/posthog.tsx` | 22 | False positive - "debugging" keyword triggered detection |
| `components/discovery/DiscoveryChat.tsx` | 60 | **RESOLVED** - Debug useEffect removed (2026-02-07) |

### 3. Deep Nesting (6 Critical Cases)

| File | Max Depth | Status |
|------|-----------|--------|
| `app/api/discovery/chat/route.ts` | 9 → 4 levels | **RESOLVED** - Extracted `createStreamingResponse` and `streamMessages` helpers (2026-02-07) |
| `app/api/discovery/agent/route.ts` | 8 → 4 levels | **RESOLVED** - Extracted `processToolUseBlocks` and `processSingleToolUse` helpers, used early returns (2026-02-07) |
| `components/ui/chart.tsx` | 7 levels | Pending - Simplify component structure |

### 4. Long Parameter Lists - **ALL FIXED** (2026-02-07)

| File | Function | Params | Status |
|------|----------|--------|--------|
| ~~`services/discoveryService.ts`~~ | multiple | 10-12 | **RESOLVED** - Refactored to options objects in `services/discovery/` (2026-02-07) |
| ~~`components/payments/PayFastButton.tsx`~~ | props | 14 | **RESOLVED** - Grouped into `customer` and `payment` objects (2026-02-07) |

### 5. Console Statements - **ALL REMOVED** (2026-02-07)

~~Debug logs left throughout codebase~~ - All 74 console statements removed from:
- Services (authService, betaSignupService, discoveryService)
- Components (ContactForm, admin, discovery, payments)
- Hooks (useBetaFormSubmission)
- Lib files (discovery-engine, playbook-loader, payfast)
- API routes (discovery, payments)
- Contexts (AuthContext)

### 6. Weak Typing - **ALL FIXED** (2026-02-07)

| File | Line | Status |
|------|------|--------|
| `services/authService.ts` | 25, 32, 37, 48 | **FIXED** - Added `getErrorMessage` helper, typed errors as `unknown`, return `Models.Session` |
| `components/auth/RegisterForm.tsx` | 40 | **FIXED** - Used `unknown` with `instanceof Error` check |
| `components/auth/LoginForm.tsx` | 27 | **FIXED** - Used `unknown` with `instanceof Error` check |

### 7. Legacy Code - **ALL DELETED** (2026-02-07)

~~As noted in CLAUDE.md, these files were old Vite code:~~

- ~~`src/pages-old/` - Old Vite route pages~~
- ~~`src/App.tsx` - Old Vite app entry~~
- ~~`src/main.tsx` - Old Vite entry point~~
- ~~`api-old/` - Old Vercel API functions~~
- ~~`vite.config.ts` - Old Vite config~~
- ~~`index.html` - Old Vite HTML entry~~

---

## Complex Functions (Top 10 by Complexity)

| File | Function | Complexity | Lines |
|------|----------|------------|-------|
| `pages-old/Contact.tsx` | Contact | 19 | 269 |
| `components/ContactForm.tsx` | ContactForm | 18 | 254 |
| `pages-old/BlogPost.tsx` | BlogPost | 15 | 188 |
| `components/FAQ.tsx` | FAQ | 12 | 70 |
| `pages-old/Discovery.tsx` | Discovery | 11 | 127 |
| `pages-old/About.tsx` | About | 10 | 303 |
| `components/BlogContent.tsx` | BlogContent | 9 | 54 |
| `components/CaseStudiesContent.tsx` | CaseStudiesContent | 6 | 142 |
| `components/Testimonials.tsx` | Testimonials | 6 | 76 |

---

## Priority Action Plan

### Immediate (This Sprint)
- [x] ~~Investigate and fix BUG comments~~ - Investigated: 1 false positive, 1 debug code removed (2026-02-07)
- [x] ~~Review critical deep nesting in discovery API routes~~ - Refactored both routes with helper functions (2026-02-07)

### High Priority (Next Sprint)
- [x] ~~Refactor `services/discoveryService.ts` - split into smaller services~~ - Split into 8 modules in `services/discovery/` (2026-02-07)
- [x] ~~Simplify nested logic in `app/api/discovery/chat/route.ts`~~ - Extracted helpers (2026-02-07)
- [x] ~~Convert long parameter lists to options objects~~ - Done in discovery services (2026-02-07)

### Medium Priority (This Quarter)
- [x] ~~Delete `pages-old/` directory and other legacy Vite files~~ - All deleted (2026-02-07)
- [x] ~~Remove/replace 74 console statements with proper logging~~ - All removed (2026-02-07)
- [ ] Split large component files (sidebar, ToolkitSessionContent)
- [x] ~~Fix weak typing (replace `any` with proper types)~~ (2026-02-07)

### Low Priority (Opportunistic)
- [ ] Extract magic numbers to named constants
- [ ] Add missing documentation
- [ ] Improve test coverage

---

## Metrics to Track

| Metric | Current | Target |
|--------|---------|--------|
| Total Issues | ~235 | < 100 |
| High Severity | ~60 | 0 |
| Console Statements | 0 | 0 |
| Files > 500 lines | 4 | 0 |
| `any` types | 0 | 0 |
| Long parameter lists | 0 | 0 |

---

## Review Schedule

- **Weekly:** Review new TODO/FIXME comments
- **Monthly:** Re-run analysis, update this register
- **Quarterly:** Full architecture review

---

## Changelog

| Date | Item | Action |
|------|------|--------|
| 2026-02-07 | `components/discovery/DiscoveryChat.tsx` | Removed debug useEffect (lines 60-69) |
| 2026-02-07 | `app/api/discovery/chat/route.ts` | Extracted `createStreamingResponse` and `streamMessages` helpers to reduce nesting from 9 to 4 levels |
| 2026-02-07 | `app/api/discovery/agent/route.ts` | Extracted `processToolUseBlocks` and `processSingleToolUse` helpers, used early returns to reduce nesting from 8 to 4 levels |
| 2026-02-07 | `src/pages-old/` | Deleted entire legacy Vite pages directory (12 files) |
| 2026-02-07 | Legacy Vite files | Deleted `src/App.tsx`, `src/main.tsx`, `api-old/`, `vite.config.ts`, `index.html` |
| 2026-02-07 | Weak typing | Fixed all 6 `any` types in authService.ts, RegisterForm.tsx, LoginForm.tsx |
| 2026-02-07 | Console statements | Removed all 74 console.log/warn/error statements across 23 files |
| 2026-02-07 | `services/discoveryService.ts` | Refactored 696-line monolith into 8 focused modules in `services/discovery/`: client.ts, types.ts, session.ts, chat.ts, spec.ts, agent.ts, email.ts, index.ts. All functions now use options object pattern. |
| 2026-02-07 | `components/payments/PayFastButton.tsx` | Refactored 14 flat props into grouped objects: `customer: { email, firstName, lastName }` and `payment: { itemName, itemDescription, amount, product }` |

---

*Report generated by tech-debt-analyzer skill*
