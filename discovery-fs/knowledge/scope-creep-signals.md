# Scope Creep Early Warning Signals

## Verbal Signals

### "While we're at it..."
**What they say**: "While we're at it, could we also..."
**What it means**: New requirement being added mid-stream
**Response**: "Let's capture that for v2. For now, let's stay focused on [core goal]."

### "It should be easy to..."
**What they say**: "That should be easy to add, right?"
**What it means**: Underestimating complexity, testing your boundaries
**Response**: "Let me add it to the list, and we'll assess complexity during planning."

### "What if..."
**What they say**: "What if users also want to..."
**What it means**: Hypothetical use case without validation
**Response**: "Have users actually asked for that, or is it a guess?"

### "Competitors have..."
**What they say**: "Competitor X has this feature..."
**What it means**: Feature envy without strategic rationale
**Response**: "Why do you think they built that? Is it core to their value prop or yours?"

### "Users might..."
**What they say**: "Users might want to..."
**What it means**: Speculation, not validated need
**Response**: "Have you talked to users about this? What did they say?"

### "Just one more thing..."
**What they say**: "Just one more thing - it's small..."
**What it means**: Death by a thousand cuts
**Response**: "Let's add it to the backlog and prioritize against everything else."

---

## Behavioral Signals

### Every Feature is "Must-Have"
**Pattern**: Nothing is nice-to-have, everything is essential
**Risk**: No prioritization means no focus
**Intervention**: Force-rank with constraints: "If you had half the budget, what goes?"

### Scope Grows After Each Meeting
**Pattern**: New requirements appear between sessions
**Risk**: Unlimited scope, unclear finish line
**Intervention**: Baseline the requirements, track additions explicitly

### Different Answers from Different People
**Pattern**: CEO says X, PM says Y, Engineering says Z
**Risk**: Building for no one by trying to please everyone
**Intervention**: Switch to Route C (Stakeholder Alignment)

### Reluctance to Cut Anything
**Pattern**: "We need ALL of these features"
**Risk**: Overbuilt v1 that never ships
**Intervention**: "What's the smallest thing that's still valuable?"

### Constant Reference to "Later"
**Pattern**: "We'll figure that out later"
**Risk**: Hard problems deferred until they're blocking
**Intervention**: Surface now: "What specifically needs to be decided later? Who decides?"

---

## Document Signals

### Requirements Keep Changing
**Pattern**: Same requirement rewritten 3+ times
**Risk**: Unclear thinking, not ready for development
**Intervention**: Pause, validate understanding, get explicit sign-off

### Too Many Open Questions
**Pattern**: More questions than requirements
**Risk**: Discovery not complete, premature spec
**Intervention**: Resolve questions before generating SPEC

### Contradictory Requirements
**Pattern**: Feature A conflicts with Feature B
**Risk**: Technical debt, impossible to build
**Intervention**: Surface conflict, force a decision

### Missing "Why"
**Pattern**: Requirements without rationale
**Risk**: No way to make trade-offs
**Intervention**: For each requirement, capture WHY it matters

---

## Prevention Strategies

### 1. Explicit Scope Boundaries
- "Here's what's IN scope: ..."
- "Here's what's OUT of scope: ..."
- Get sign-off on both

### 2. Change Control Process
- New requests go on a list
- Evaluate impact before accepting
- Trade-off: add X, remove Y

### 3. Time Boxing
- "We have X weeks for this phase"
- New scope = extended timeline
- Make the trade-off visible

### 4. MVP Definition
- Define the smallest valuable release
- Protect it fiercely
- Everything else is "after v1"

### 5. Regular Scope Reviews
- Weekly: "Are we still building the same thing?"
- Surface drift early
- Re-baseline when needed
