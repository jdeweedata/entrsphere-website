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

### 1. Large Files (6 files exceed 500 lines)

| File | Lines | Priority | Recommendation |
|------|-------|----------|----------------|
| `components/ui/sidebar.tsx` | 762 | Medium | Split into smaller components |
| `components/discovery/ToolkitSessionContent.tsx` | 756 | Medium | Extract sub-components |
| `services/discoveryService.ts` | 696 | High | Split by responsibility |
| `pages-old/BlogPost.tsx` | 604 | Low | Delete (legacy) |
| `app/api/discovery/agent/route.ts` | 556 | Medium | Extract helper functions |
| `components/BlogPostContent.tsx` | 540 | Medium | Split into sections |

### 2. BUG Comments (Investigated)

| Location | Line | Status |
|----------|------|--------|
| `lib/posthog.tsx` | 22 | False positive - "debugging" keyword triggered detection |
| `components/discovery/DiscoveryChat.tsx` | 60 | **RESOLVED** - Debug useEffect removed (2026-02-07) |

### 3. Deep Nesting (6 Critical Cases)

| File | Max Depth | Recommendation |
|------|-----------|----------------|
| `app/api/discovery/chat/route.ts` | 9 levels | Extract to helper functions, use early returns |
| `app/api/discovery/agent/route.ts` | 8 levels | Flatten logic, extract handlers |
| `components/ui/chart.tsx` | 7 levels | Simplify component structure |

### 4. Long Parameter Lists (Top Offenders)

| File | Function | Params | Recommendation |
|------|----------|--------|----------------|
| `services/discoveryService.ts:657` | - | 12 | Use options object |
| `components/payments/PayFastButton.tsx:45` | - | 14 | Use options object |
| `components/payments/PayFastButton.tsx:82` | - | 12 | Use options object |
| `services/discoveryService.ts:162` | - | 10 | Use options object |
| `services/discoveryService.ts:222` | - | 10 | Use options object |
| `services/discoveryService.ts:535` | - | 10 | Use options object |

### 5. Console Statements (74 total)

Debug logs left throughout codebase. Key locations:

| File | Count | Action |
|------|-------|--------|
| `contexts/AuthContext.tsx` | 2 | Remove or use proper logging |
| `components/ContactForm.tsx` | 1 | Remove |
| `hooks/useBetaFormSubmission.ts` | 2 | Remove |
| `lib/payfast.ts` | 1 | Use proper error handling |
| `lib/playbook-loader.ts` | 4 | Use proper logging |
| Various others | 64 | Audit and remove |

### 6. Weak Typing (6 instances of `any`)

| File | Line | Recommendation |
|------|------|----------------|
| `services/authService.ts` | 25, 32, 37, 48 | Type errors properly |
| `components/auth/RegisterForm.tsx` | 40 | Type errors properly |
| `components/auth/LoginForm.tsx` | 27 | Type errors properly |

### 7. Legacy Code (Can Be Deleted)

As noted in CLAUDE.md, these files are old Vite code:

- `src/pages-old/` - Old Vite route pages
- `src/App.tsx` - Old Vite app entry
- `src/main.tsx` - Old Vite entry point
- `api-old/` - Old Vercel API functions
- `vite.config.ts` - Old Vite config
- `index.html` - Old Vite HTML entry

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
- [ ] Review critical deep nesting in discovery API routes

### High Priority (Next Sprint)
- [ ] Refactor `services/discoveryService.ts` - split into smaller services
- [ ] Simplify nested logic in `app/api/discovery/chat/route.ts`
- [ ] Convert long parameter lists to options objects

### Medium Priority (This Quarter)
- [ ] Delete `pages-old/` directory and other legacy Vite files
- [ ] Remove/replace 74 console statements with proper logging
- [ ] Split large component files (sidebar, ToolkitSessionContent)
- [ ] Fix weak typing (replace `any` with proper types)

### Low Priority (Opportunistic)
- [ ] Extract magic numbers to named constants
- [ ] Add missing documentation
- [ ] Improve test coverage

---

## Metrics to Track

| Metric | Current | Target |
|--------|---------|--------|
| Total Issues | 333 | < 100 |
| High Severity | 72 | 0 |
| Console Statements | 73 | 0 |
| Files > 500 lines | 6 | 0 |
| `any` types | 6 | 0 |

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

---

*Report generated by tech-debt-analyzer skill*
