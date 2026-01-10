# Route A: Standard Discovery Playbook

## Profile
- **Signal**: Clear, direct answers with specific examples
- **Duration**: 30-45 minutes
- **Success Rate**: 73% of projects with clear initial requirements ship on time

## What This Means
The user knows what they want. They have a specific vision, can articulate requirements, and have decision-making authority. Your job is to **document thoroughly**, not discover.

## Interview Strategy

### Phase 1: Validate Clarity (5 min)
Confirm their clarity is real, not assumed:
- "Walk me through the core user journey"
- "What's the single most important feature?"
- "What would make this project a failure?"

### Phase 2: Deep Requirements (20 min)
Extract every edge case NOW:
- Feature-by-feature walkthrough
- "What happens when [edge case]?"
- "Who else uses this? What do they need differently?"
- Data requirements and sources
- Integration touchpoints

### Phase 3: Constraints & Success Criteria (10 min)
- Hard deadlines and why
- Budget constraints
- Technical constraints (hosting, stack, compliance)
- Definition of "done"

### Phase 4: Risk Identification (5 min)
- "What could derail this?"
- "What assumptions are we making?"
- "Who else needs to approve this?"

## Red Flags to Watch For
- Answers that start with "It depends..." (may be Route B)
- Hesitation when naming decision-makers (may be Route C)
- Frequent mentions of existing systems (may be Route D)
- Scope expanding during conversation

## Output: SPEC.json
Generate a complete SPEC.json with:
- All features with acceptance criteria
- Clear priority tiers (must-have vs nice-to-have)
- Technical constraints documented
- Timeline and budget captured
- Open questions list (should be short)

## Common Pitfalls
1. **Assuming too much** - Document the obvious too
2. **Missing edge cases** - They'll come back during dev
3. **Skipping "why"** - Understanding motivation prevents scope creep
4. **Not capturing constraints** - Budget/timeline surprises kill projects
