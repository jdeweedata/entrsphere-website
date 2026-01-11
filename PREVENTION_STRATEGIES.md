# Prevention Strategies and Best Practices

## Issue Summary
ConvexProvider was not wrapping children until after mount, causing React hooks (useQuery, useMutation) to fail during initial render. This was solved by using `useMemo` for client creation instead of delaying provider wrapping with `useEffect` mount state.

---

## 1. Convex Provider Setup Best Practices

### Problem Pattern (ANTI-PATTERN)
```typescript
// DO NOT USE THIS PATTERN
export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);  // Delays provider wrapping
  }, []);

  if (mounted && convexClient) {
    return <ConvexProvider client={convexClient}>{content}</ConvexProvider>;
  }
  return content; // Renders without provider on first render
}
```

**Why this fails:**
- First render happens without ConvexProvider
- Components using Convex hooks render without provider context
- React throws "useQuery must be used within ConvexProvider" error
- Hydration mismatch between server and client renders
- Breaks form submission and data mutations

### Solution Pattern (CORRECT)
```typescript
export function ClientProviders({ children }: ClientProvidersProps) {
  // Create QueryClient once with useState initializer
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Create Convex client ONCE with useMemo (no dependency array = once per component instance)
  const convexClient = useMemo(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (typeof window !== "undefined" && convexUrl) {
      return new ConvexReactClient(convexUrl);
    }
    return null;
  }, []);

  const content = (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

  // Always wrap with ConvexProvider when client exists (no delayed rendering)
  if (convexClient) {
    return <ConvexProvider client={convexClient}>{content}</ConvexProvider>;
  }

  return content;
}
```

**Key Points:**
- `useMemo` creates client on first render, caches it (empty deps)
- Client initialization is synchronous and safe
- Provider wraps children immediately on all renders
- No `useEffect` mount detection needed
- Safe for both SSR and CSR because `typeof window` check prevents server errors

### Prevention Rules

1. **Never delay provider wrapping with mount state**
   - Providers should wrap on first render, not after useEffect
   - If you need conditional logic, check before return statement, not in useEffect

2. **Use `useMemo` for expensive client initialization**
   - Create clients once per component instance
   - Empty dependency array `[]` = cache forever
   - Don't create new client on every render

3. **Use `useState` initializer for complex defaults**
   ```typescript
   // Good - runs once
   const [queryClient] = useState(() => new QueryClient({...}));

   // Bad - runs on every render
   const [queryClient] = useState(new QueryClient({...}));
   ```

4. **Always include `typeof window !== "undefined"` check**
   - Prevents ReferenceError in server components
   - Safely handles SSR/CSR transitions
   - Don't rely on "use client" directive alone

---

## 2. Testing Waitlist Flows Comprehensively

### Setup Test Environment

Create test file: `src/components/waitlist/WaitlistGateModal.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WaitlistGateModal } from './WaitlistGateModal';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { expect, describe, it, vi, beforeEach } from 'vitest';

// Mock Convex hooks
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  ConvexProvider: ({ children }: any) => children,
  ConvexReactClient: vi.fn(),
}));

describe('WaitlistGateModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    source: 'discovery',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });
```

### Test Case 1: Form Submission with React-Controlled Inputs

```typescript
it('should handle email input and form submission', async () => {
  const mockJoinWaitlist = vi.fn().mockResolvedValue({
    success: true,
    message: 'You\'re #1 on the waitlist!',
    position: 1,
    cohort: 1,
    positionInCohort: 1,
  });

  vi.mocked(useMutation).mockReturnValue(mockJoinWaitlist as any);
  vi.mocked(useQuery).mockReturnValue({
    totalWaiting: 23,
    currentCohort: 1,
    spotsLeftInCohort: 2,
    cohortSize: 25,
  } as any);

  render(
    <WaitlistGateModal {...defaultProps} />
  );

  // Find input and button
  const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
  const submitButton = screen.getByRole('button', { name: /Join Cohort/i });

  // Type email
  await userEvent.type(emailInput, 'test@example.com');
  expect(emailInput.value).toBe('test@example.com');

  // Submit form
  fireEvent.click(submitButton);

  // Verify mutation called
  await waitFor(() => {
    expect(mockJoinWaitlist).toHaveBeenCalledWith({
      email: 'test@example.com',
      source: 'discovery',
    });
  });
});
```

### Test Case 2: Counter Updates After Signup

```typescript
it('should update counter display after successful signup', async () => {
  const mockJoinWaitlist = vi.fn().mockResolvedValue({
    success: true,
    position: 1,
    cohort: 1,
  });

  vi.mocked(useMutation).mockReturnValue(mockJoinWaitlist as any);

  // Initial stats
  vi.mocked(useQuery)
    .mockReturnValueOnce({
      totalWaiting: 23,
      currentCohort: 1,
      spotsLeftInCohort: 2,
    })
    // After signup, show 24 waiting
    .mockReturnValueOnce({
      totalWaiting: 24,
      currentCohort: 1,
      spotsLeftInCohort: 1,
    });

  const { rerender } = render(
    <WaitlistGateModal {...defaultProps} />
  );

  // Check initial count
  expect(screen.getByText(/23 founders waiting/)).toBeInTheDocument();

  // Submit signup
  const emailInput = screen.getByPlaceholderText('your@email.com');
  await userEvent.type(emailInput, 'test@example.com');
  fireEvent.click(screen.getByRole('button', { name: /Join Cohort/i }));

  // Rerender with updated stats
  rerender(<WaitlistGateModal {...defaultProps} />);

  // Verify counter updated
  await waitFor(() => {
    expect(screen.getByText(/24 founders waiting/)).toBeInTheDocument();
  });
});
```

### Test Case 3: Duplicate Email Handling

```typescript
it('should reject duplicate email with appropriate message', async () => {
  const mockJoinWaitlist = vi.fn().mockResolvedValue({
    success: false,
    message: 'You\'re already on the waitlist!',
    position: 5,
    cohort: 1,
  });

  vi.mocked(useMutation).mockReturnValue(mockJoinWaitlist as any);
  vi.mocked(useQuery).mockReturnValue({
    totalWaiting: 23,
    currentCohort: 1,
    spotsLeftInCohort: 2,
  } as any);

  render(
    <WaitlistGateModal {...defaultProps} />
  );

  const emailInput = screen.getByPlaceholderText('your@email.com');
  await userEvent.type(emailInput, 'existing@example.com');

  fireEvent.click(screen.getByRole('button', { name: /Join Cohort/i }));

  // Should show error message, not success
  await waitFor(() => {
    expect(screen.queryByText(/You\'re on the list!/)).not.toBeInTheDocument();
    expect(screen.getByText(/You\'re already on the waitlist!/)).toBeInTheDocument();
  });

  // Email should NOT be cleared on failure
  const input = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
  expect(input.value).toBe('existing@example.com');
});
```

### Test Case 4: Cohort Boundary Conditions

```typescript
it('should handle cohort boundary at position 25/26', async () => {
  const testCases = [
    {
      totalWaiting: 24, // Position 48 = Cohort 2, Position 23
      expectedCohort: 2,
      expectedSpots: 2,
    },
    {
      totalWaiting: 25, // Position 49 = Cohort 2, Position 24
      expectedCohort: 2,
      expectedSpots: 1,
    },
    {
      totalWaiting: 26, // Position 50 = Cohort 2, Position 25 (last in cohort)
      expectedCohort: 2,
      expectedSpots: 0,
    },
    {
      totalWaiting: 27, // Position 51 = Cohort 3, Position 1
      expectedCohort: 3,
      expectedSpots: 25,
    },
  ];

  for (const testCase of testCases) {
    vi.mocked(useQuery).mockReturnValue({
      totalWaiting: testCase.totalWaiting,
      currentCohort: testCase.expectedCohort,
      spotsLeftInCohort: testCase.expectedSpots,
      cohortSize: 25,
    } as any);

    const { unmount } = render(
      <WaitlistGateModal {...defaultProps} />
    );

    const spotsText = screen.getByText(new RegExp(`${testCase.expectedSpots} spots left`));
    expect(spotsText).toBeInTheDocument();

    unmount();
  }
});
```

### Test Case 5: Modal Open/Close State

```typescript
it('should clear state when closing modal', async () => {
  const mockOnOpenChange = vi.fn();

  const mockJoinWaitlist = vi.fn().mockResolvedValue({
    success: true,
    message: 'Success!',
    position: 1,
    cohort: 1,
  });

  vi.mocked(useMutation).mockReturnValue(mockJoinWaitlist as any);
  vi.mocked(useQuery).mockReturnValue({
    totalWaiting: 23,
    currentCohort: 1,
    spotsLeftInCohort: 2,
  } as any);

  const { rerender } = render(
    <WaitlistGateModal
      open={true}
      onOpenChange={mockOnOpenChange}
      source="discovery"
    />
  );

  // Type email and submit
  const emailInput = screen.getByPlaceholderText('your@email.com');
  await userEvent.type(emailInput, 'test@example.com');
  fireEvent.click(screen.getByRole('button', { name: /Join Cohort/i }));

  // Wait for success message
  await waitFor(() => {
    expect(screen.getByText(/You\'re on the list!/)).toBeInTheDocument();
  });

  // Click close button
  const closeButton = screen.getByRole('button', { name: /Close/i });
  fireEvent.click(closeButton);

  // onOpenChange should be called with false
  expect(mockOnOpenChange).toHaveBeenCalledWith(false);

  // Reopen modal
  rerender(
    <WaitlistGateModal
      open={true}
      onOpenChange={mockOnOpenChange}
      source="discovery"
    />
  );

  // Form should be reset (no email shown, success message gone)
  const newEmailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
  expect(newEmailInput.value).toBe('');
  expect(screen.queryByText(/You\'re on the list!/)).not.toBeInTheDocument();
});
```

### Test Case 6: Network Error Handling

```typescript
it('should handle network errors gracefully', async () => {
  const mockJoinWaitlist = vi.fn().mockRejectedValue(
    new Error('Network error')
  );

  vi.mocked(useMutation).mockReturnValue(mockJoinWaitlist as any);
  vi.mocked(useQuery).mockReturnValue({
    totalWaiting: 23,
    currentCohort: 1,
    spotsLeftInCohort: 2,
  } as any);

  render(
    <WaitlistGateModal {...defaultProps} />
  );

  const emailInput = screen.getByPlaceholderText('your@email.com');
  await userEvent.type(emailInput, 'test@example.com');

  const submitButton = screen.getByRole('button', { name: /Join Cohort/i });
  fireEvent.click(submitButton);

  // Should show error message
  await waitFor(() => {
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  // Button should be re-enabled
  expect(submitButton).not.toBeDisabled();

  // Email should still be in input (not cleared on error)
  const input = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
  expect(input.value).toBe('test@example.com');
});
```

---

## 3. Database Schema Best Practices

### Indexing Strategy

From `/convex/schema.ts` - apply this pattern to all query fields:

```typescript
waitlist: defineTable({
  email: v.string(),
  cohort: v.number(),
  position: v.number(),
  joinedAt: v.number(),
  source: v.optional(v.string()),
  accessGranted: v.boolean(),
  accessGrantedAt: v.optional(v.number()),
})
  .index("by_email", ["email"])        // For: checkAccess, duplicate detection
  .index("by_cohort", ["cohort"])      // For: grantCohortAccess
  .index("by_joinedAt", ["joinedAt"])  // For: list queries (sorting)
  .index("by_accessGranted", ["accessGranted"]) // For: access checks
```

**Prevention Rule:** Every field used in a `withIndex` query must have a corresponding index defined in schema.

### Email Normalization (Data Integrity)

```typescript
// In waitlist.ts mutation handler:
const existing = await ctx.db
  .query("waitlist")
  .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
  .first();

// Insert
await ctx.db.insert("waitlist", {
  email: args.email.toLowerCase(), // ALWAYS lowercase before storing
  cohort,
  position: displayPosition,
  joinedAt: Date.now(),
  source: args.source,
  accessGranted: false,
});
```

**Prevention Rule:** Always lowercase emails before storage and queries to prevent duplicate-email bugs.

### Source Tracking for Analytics

```typescript
// Always capture source in signup
await ctx.db.insert("waitlist", {
  email: args.email.toLowerCase(),
  cohort,
  position: displayPosition,
  joinedAt: Date.now(),
  source: args.source,  // "homepage", "discovery", "linkedin", etc.
  accessGranted: false,
});
```

**Prevention Rule:** Track source in all user-initiated actions for analytics and attribution.

---

## 4. Constant Management

### Use Constants for Cohort Configuration

File: `convex/waitlist.ts`

```typescript
const COHORT_SIZE = 25;     // Cohort batch size
const SEED_COUNT = 23;      // Initial social proof count

// Why seed count matters:
// - Shows social proof without real users
// - New user joins as #24 (looks real, not #1)
// - Seed count = realistic starting number for platform
// - Can be adjusted: 0 = pure growth tracking
```

**Prevention Rules:**
1. Never hardcode cohort size - use constant
2. Never hardcode seed count - use constant
3. Update constants in one place affects all calculations
4. Document the purpose of each constant

### Cohort Calculation (Correct Formula)

```typescript
// Display position = seed count + real entries + 1
const displayPosition = SEED_COUNT + realCount + 1;

// Calculate which cohort (1-indexed)
const cohort = Math.ceil(displayPosition / COHORT_SIZE);

// Position within cohort (1-25)
const positionInCohort = ((displayPosition - 1) % COHORT_SIZE) + 1;

// Spots remaining in current cohort
const spotsLeftInCohort = COHORT_SIZE - positionInCohort;
```

**Verification Examples:**
```
Real count: 0  -> Display: 24 -> Cohort 1, Pos 24, Spots left: 1
Real count: 1  -> Display: 25 -> Cohort 1, Pos 25, Spots left: 0
Real count: 2  -> Display: 26 -> Cohort 2, Pos 1,  Spots left: 25
Real count: 26 -> Display: 50 -> Cohort 2, Pos 25, Spots left: 0
Real count: 27 -> Display: 51 -> Cohort 3, Pos 1,  Spots left: 25
```

---

## 5. Form State Management Best Practices

### Pattern: React Hook Form with Controlled Inputs

```typescript
// WaitlistGateModal.tsx
const [email, setEmail] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [result, setResult] = useState<{
  success: boolean;
  message: string;
  position?: number;
  cohort?: number;
} | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || isSubmitting) return;  // Guard: no empty emails

  setIsSubmitting(true);
  try {
    const response = await joinWaitlist({
      email,  // React state
      source,
    });
    setResult(response);
    if (response.success) {
      setEmail("");  // Clear ONLY on success
    }
  } catch (error) {
    setResult({
      success: false,
      message: "Something went wrong. Please try again.",
    });
    // NOTE: Email is NOT cleared on error - user can retry
  } finally {
    setIsSubmitting(false);
  }
};

const handleClose = () => {
  setResult(null);  // Clear result
  setEmail("");     // Clear email on close
  onOpenChange(false);
};
```

**Prevention Rules:**
1. Clear email on successful submission (good UX)
2. Do NOT clear email on error (user can retry)
3. Clear result when modal closes (fresh state on reopen)
4. Always guard against double-submission with `isSubmitting` flag
5. Guard against empty input with early return

---

## 6. Error Handling Strategy

### Mutation Error Scenarios

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || isSubmitting) return;

  setIsSubmitting(true);
  try {
    const response = await joinWaitlist({
      email,
      source,
    });

    // Handle Convex-returned errors (not exceptions)
    if (response.success) {
      setEmail("");  // Success path
    } else {
      // response.success === false, but no exception thrown
      setResult(response);  // Shows: "You're already on the waitlist!"
    }

    setResult(response);  // Always set result
  } catch (error) {
    // Handle actual JavaScript exceptions (network, parsing, etc.)
    setResult({
      success: false,
      message: "Something went wrong. Please try again.",
    });
    console.error("Waitlist signup error:", error);
  } finally {
    setIsSubmitting(false);  // Always re-enable button
  }
};
```

**Prevention Rule:** Distinguish between:
- Business logic errors (duplicate email) = set result
- JavaScript exceptions (network) = catch block
- Always call `setIsSubmitting(false)` in finally

---

## 7. Convex Query/Mutation Best Practices

### Query: Get Current Stats

```typescript
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all (cheap operation for waitlist)
    const allEntries = await ctx.db.query("waitlist").collect();
    const realCount = allEntries.length;
    const totalWaiting = SEED_COUNT + realCount;

    // Recalculate current cohort each time (no stale data)
    const currentCohort = Math.ceil(totalWaiting / COHORT_SIZE) || 1;
    const filledInCurrentCohort = ((totalWaiting - 1) % COHORT_SIZE) + 1;
    const spotsLeft = COHORT_SIZE - filledInCurrentCohort;

    return {
      totalWaiting,
      currentCohort,
      spotsLeftInCohort: spotsLeft > 0 ? spotsLeft : 0,
      cohortSize: COHORT_SIZE,
    };
  },
});
```

**Prevention Rules:**
1. Return computed values, not raw data (easier for UI)
2. Recalculate on each query (no stale state)
3. Guard against edge cases (spotsLeft > 0 check)
4. Return cohortSize for UI context

### Mutation: Join Waitlist

```typescript
export const join = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Check for duplicates with index
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      return {
        success: false,
        message: "You're already on the waitlist!",
        position: existing.position,
        cohort: existing.cohort,
      };
    }

    // 2. Calculate position
    const allEntries = await ctx.db.query("waitlist").collect();
    const realCount = allEntries.length;
    const displayPosition = SEED_COUNT + realCount + 1;

    // 3. Calculate cohort
    const cohort = Math.ceil(displayPosition / COHORT_SIZE);
    const positionInCohort = ((displayPosition - 1) % COHORT_SIZE) + 1;

    // 4. Insert new entry
    await ctx.db.insert("waitlist", {
      email: args.email.toLowerCase(),
      cohort,
      position: displayPosition,
      joinedAt: Date.now(),
      source: args.source,
      accessGranted: false,
    });

    // 5. Return detailed response
    return {
      success: true,
      message: `You're #${displayPosition} on the waitlist!`,
      position: displayPosition,
      positionInCohort,
      cohort,
      spotsLeftInCohort: COHORT_SIZE - positionInCohort,
    };
  },
});
```

**Prevention Rules:**
1. Always check duplicates FIRST
2. Always lowercase email before comparison and storage
3. Return detailed response for UI feedback
4. Include all calculated values (position, cohort, spots)
5. Use transactions for multi-step operations (if available)

---

## 8. Client-Side Convex Hooks Usage

### Using useQuery for Stats

```typescript
const stats = useQuery(api.waitlist.getStats);

// Remember: stats is undefined initially, then loads
return (
  <div>
    {stats && (
      <p className="text-sm text-slate-500 mt-4">
        {stats.totalWaiting} founders waiting • {stats.spotsLeftInCohort} spots left
      </p>
    )}
  </div>
);
```

**Prevention Rule:** Always guard against undefined for useQuery results.

### Using useMutation for Join

```typescript
const joinWaitlist = useMutation(api.waitlist.join);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || isSubmitting) return;

  setIsSubmitting(true);
  try {
    const response = await joinWaitlist({
      email,
      source,
    });
    setResult(response);
  } catch (error) {
    setResult({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

**Prevention Rules:**
1. Always wrap in try/catch
2. Always set isSubmitting in finally
3. Handle both success and error response objects
4. Don't forget to pass source for analytics

---

## 9. Component Testing Checklist

Before shipping any component with Convex:

- [ ] Test initial render without provider (should fail gracefully or not render)
- [ ] Test initial render WITH provider (should work)
- [ ] Test form submission with valid input
- [ ] Test form submission with invalid input
- [ ] Test duplicate email handling
- [ ] Test network error handling
- [ ] Test loading state (isSubmitting)
- [ ] Test result display (success vs error)
- [ ] Test modal open/close cycles
- [ ] Test counter updates after data change
- [ ] Test boundary conditions (cohort limits, email edge cases)
- [ ] Test accessibility (labels, ARIA, keyboard navigation)
- [ ] Test responsive design (mobile, tablet, desktop)

---

## 10. Deployment Checklist

Before deploying Convex changes:

- [ ] Run `npm run type-check:memory` (no TypeScript errors)
- [ ] All database indexes defined for used fields
- [ ] All queries use indexes where possible
- [ ] All email inputs lowercase before storage
- [ ] Source tracking added to all user-initiated mutations
- [ ] Constants defined (COHORT_SIZE, SEED_COUNT, etc.)
- [ ] Cohort calculations verified with boundary tests
- [ ] All test cases from this document pass
- [ ] Error handling covers network + business logic errors
- [ ] Provider wrapping happens immediately (no mount delays)
- [ ] Environment variables configured in Vercel

---

## Summary: Key Takeaways

1. **Provider Wrapping:** Never delay with useEffect; use useMemo for client creation
2. **Testing:** Use comprehensive test cases covering happy path, errors, and boundaries
3. **Schema:** Index all query fields; lowercase emails; track source
4. **Constants:** Use COHORT_SIZE and SEED_COUNT for cohort calculations
5. **Forms:** React state management with proper error handling and loading states
6. **Mutations:** Check duplicates first, return detailed responses
7. **Hooks:** Guard against undefined for useQuery, wrap useMutation in try/catch
8. **Deployment:** Run type-check, verify indexes, test boundaries

---

## References

- **Providers file:** `src/components/ClientProviders.tsx`
- **Waitlist mutations:** `convex/waitlist.ts`
- **Waitlist schema:** `convex/schema.ts` (lines 250-263)
- **UI component:** `src/components/waitlist/WaitlistGateModal.tsx`
