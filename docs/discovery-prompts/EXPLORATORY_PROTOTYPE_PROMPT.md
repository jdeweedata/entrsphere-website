# Exploratory Prototype Prompt

> **For Claude Code — "I'll Know It When I See It" Projects**  
> Use this when stakeholders can't articulate requirements upfront and need to see something tangible first.

---

## 🎯 When to Use This Prompt

Use this instead of detailed requirements gathering when you hear:

| Stakeholder Says | What It Means |
|------------------|---------------|
| "I'll know it when I see it" | They can't articulate requirements abstractly |
| "Let's just build something and iterate" | They think better by reacting than imagining |
| "I'm not sure yet, let's explore" | The problem space is unclear |
| "Can you just show me some options?" | They need visual/tangible starting points |
| "We've never done this before" | No existing mental model to draw from |

**This prompt optimizes for:**
- Speed to first prototype (minutes, not hours)
- Showing over telling
- Capturing reactions, not requirements
- Rapid iteration cycles
- Extracting requirements *from* prototypes retrospectively

---

## 🚀 Quick Context (5 Minutes Max)

Before we build anything, I just need the basics. Don't overthink these—gut reactions are fine.

### The 5 Essential Questions:

1. **What's the one-sentence version?**
   > "We need a way to _______________"

2. **Who's it for?**
   > "It's for [person/role] when they're trying to [do something]"

3. **What exists today?**
   > "Right now they [use X / do nothing / struggle with Y]"

4. **What's one thing it MUST do?**
   > "At minimum, it needs to _______________"

5. **What's definitely wrong?**
   > "If it does [X], that's a dealbreaker"

**That's it.** We'll figure out the rest by building.

---

## Interview Instructions for Claude

### Philosophy: Build → Show → Learn → Repeat

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Quick      │ ──► │  Build      │ ──► │  Show &     │ ──► │  Capture    │
│  Context    │     │  Prototype  │     │  React      │     │  & Iterate  │
│  (5 min)    │     │  (fast)     │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           ▲                                       │
                           └───────────────────────────────────────┘
```

### Step 1: Gather Minimum Context

Use AskUserQuestionTool to ask ONLY these 5 questions. Keep it fast and casual.

```
Q1: "In one sentence, what do you need? Start with 'We need a way to...'"

Q2: "Who's going to use this, and what are they trying to do when they reach for it?"

Q3: "What do they do today? (Even if it's nothing or a messy workaround)"

Q4: "What's the ONE thing this absolutely must do to be useful?"

Q5: "Is there anything that would make this a non-starter? A dealbreaker?"
```

**Rules:**
- Accept vague answers—that's expected
- Don't push for detail—we'll discover it through prototypes
- If they say "I don't know," move on
- Total time: 5 minutes max

---

### Step 2: Build First Prototype

Based on minimal context, immediately build something tangible.

**Prototype options (pick the fastest):**

| If the project involves... | Build this first |
|---------------------------|------------------|
| UI/workflow | Simple HTML mockup or React component |
| Data/reports | Sample output with fake data |
| Process/automation | Flowchart or pseudocode walkthrough |
| API/integration | Example request/response |
| Document/content | Draft outline or sample section |

**Prototype principles:**
- Ugly is fine—speed matters more than polish
- Make it interactive if possible (clickable, runnable)
- Include 2-3 variations if the direction is unclear
- Label assumptions clearly: "I assumed X—is that right?"

---

### Step 3: Show and Capture Reactions

Present the prototype and ask reaction-based questions:

```
"Here's a rough version. What's your gut reaction?"

"What jumps out as wrong or weird?"

"What's missing that you expected to see?"

"Which parts feel right? What should we keep?"

"On a scale of 1-10, how close is this to what you imagined? What would make it a 10?"
```

**Capture feedback in this format:**

```markdown
## Prototype Feedback: Round [N]

### 👍 Keep (What's Working)
- [Thing they liked]
- [Thing that felt right]

### 👎 Kill (What's Wrong)
- [Thing that's off]
- [Dealbreaker or confusion]

### 🔄 Change (Adjustments)
- [Modification requested]
- [Different direction to try]

### 💡 Discovered Requirements
- [Requirement that emerged from feedback]
- [Constraint we didn't know about]

### ❓ Still Unclear
- [Thing to explore in next prototype]
```

---

### Step 4: Iterate Rapidly

After each round of feedback:

1. **Update the prototype** based on Keep/Kill/Change
2. **Show again** with: "I made these changes: [list]. Take a look."
3. **Capture new reactions**
4. **Repeat** until stakeholder says "Yes, this is it" or "Close enough to spec out"

**Iteration rules:**
- Small changes between rounds (don't rebuild from scratch)
- Show progress frequently (every 10-15 minutes of work)
- Track what's converging vs. still in flux
- Know when to stop: 3-5 rounds usually enough

---

### Step 5: Extract Requirements Retrospectively

Once the prototype feels right, generate requirements FROM what you built:

```
"Now that we've landed on something you like, let me document what we discovered..."
```

**Generate these files:**

---

#### File 1: DISCOVERY_LOG.md

Chronicle of the exploration process (useful for future reference).

```markdown
# Discovery Log: [Project Name]

## Initial Context (What We Started With)
- **Need:** [One-sentence version]
- **User:** [Who it's for]
- **Current state:** [What exists today]
- **Must-have:** [The one essential thing]
- **Dealbreakers:** [What to avoid]

## Prototype Evolution

### Round 1: [Date/Time]
- **What we built:** [Description]
- **Reaction:** [Gut response]
- **Keep:** [What worked]
- **Kill:** [What didn't]
- **Change:** [Adjustments]

### Round 2: [Date/Time]
- **Changes made:** [What we updated]
- **Reaction:** [Response]
- **Keep/Kill/Change:** [Feedback]

### Round 3: [Date/Time]
[...]

## Final Direction
- **Landed on:** [Description of final prototype]
- **Key decisions made:** [List of choices]
- **Stakeholder sign-off:** [ ] Approved for development
```

---

#### File 2: EXTRACTED_REQUIREMENTS.md

Requirements derived from the prototype (not imagined upfront).

```markdown
# Extracted Requirements: [Project Name]

> These requirements were discovered through prototyping, not defined upfront.

## What We Built (Reference Prototype)
[Link or description of final prototype]

## User Stories (Derived from Prototype)

### Must-Have (Validated Through Iteration)
- **US-1:** As a [user], I want [feature we built] so that [benefit discovered]
  - ✓ [Behavior demonstrated in prototype]
  - ✓ [Behavior demonstrated in prototype]

- **US-2:** As a [user], I want [feature we built] so that [benefit discovered]
  - ✓ [Behavior demonstrated in prototype]

### Discovered Constraints
- [Limitation we hit during prototyping]
- [Edge case that came up]
- [Business rule that emerged]

### Rejected Alternatives
Things we tried and killed:
- [Approach 1] — Rejected because: [reason]
- [Approach 2] — Rejected because: [reason]

### Out of Scope (Explicitly Deferred)
- [Feature stakeholder mentioned but deprioritized]
- [Enhancement for later]

### Open Questions (For Development)
- [Technical question that needs answering]
- [Integration detail to figure out]
```

---

#### File 3: SPEC.json (For Development / Ralph Wiggum)

```json
{
  "project": {
    "name": "Project Name",
    "approach": "prototype-first",
    "discovery_rounds": 3,
    "created": "YYYY-MM-DD",
    "status": "ready-for-development"
  },
  "reference_prototype": {
    "location": "path/to/prototype or description",
    "stakeholder_approved": true
  },
  "features": [
    {
      "id": "US-1",
      "priority": "must-have",
      "source": "discovered-round-2",
      "user_story": "As a [user], I want [feature] so that [benefit]",
      "acceptance_criteria": [
        "Matches behavior in approved prototype",
        "When [condition], then [outcome from prototype]"
      ],
      "prototype_reference": "See [specific part of prototype]",
      "passes": false,
      "technical_notes": "FOR DEV: Match prototype behavior exactly unless noted"
    }
  ],
  "rejected_approaches": [
    {
      "description": "What we tried",
      "reason": "Why we killed it",
      "round": 1
    }
  ],
  "constraints_discovered": [
    "Constraint found during prototyping"
  ],
  "out_of_scope": [
    "Deferred feature"
  ]
}
```

---

## Quick Reference: Reaction Questions

Use these to extract feedback without asking for requirements:

| Instead of Asking... | Ask This... |
|---------------------|-------------|
| "What are your requirements?" | "What's your gut reaction to this?" |
| "What features do you need?" | "What's missing that you expected?" |
| "How should this work?" | "Does this flow feel right or weird?" |
| "What are the edge cases?" | "What could go wrong here?" |
| "Is this correct?" | "On a scale of 1-10, how close is this?" |
| "What else?" | "If you could change ONE thing, what would it be?" |

---

## Prototype Speed Tips

### For UI/UX Exploration:
```bash
# Quick HTML mockup
> Build a simple HTML page showing [concept]. 
> Use placeholder text and basic styling. 
> Make buttons clickable even if they don't do anything yet.
```

### For Multiple Directions:
```bash
# Show options
> Build 3 different versions of [concept]:
> - Option A: [approach 1]
> - Option B: [approach 2]  
> - Option C: [approach 3]
> Keep them rough. I want to see which direction resonates.
```

### For Workflow/Process:
```bash
# Walkthrough prototype
> Create a step-by-step walkthrough showing:
> 1. User starts at [point]
> 2. They do [action]
> 3. System responds with [result]
> Use fake data. Focus on the flow, not the polish.
```

### For Data/Reports:
```bash
# Sample output
> Generate a sample [report/dashboard/output] with realistic fake data.
> Show what the final result would look like.
> Include 2 variations if the format is unclear.
```

---

## When to Switch to Full Requirements Mode

After 3-5 prototype rounds, if the stakeholder says:

✅ "Yes, this is what I want" → Extract requirements, build it  
✅ "This is close, I can describe the rest" → Switch to NON_TECHNICAL_DISCOVERY_PROMPT.md  
✅ "I need to think about this more" → Pause, schedule follow-up  

❌ If still unclear after 5+ rounds → Scope may be too big, break into smaller pieces

---

## Comparison: When to Use Which Prompt

| Signal | Use This Prompt | Use Discovery Prompt |
|--------|-----------------|---------------------|
| "I'll know it when I see it" | ✅ | ❌ |
| "Here's exactly what I need..." | ❌ | ✅ |
| "Let's explore some ideas" | ✅ | ❌ |
| "We have detailed requirements" | ❌ | ✅ |
| "I'm not sure what's possible" | ✅ | ❌ |
| "Build it like [existing thing]" | ❌ | ✅ |
| New domain, no mental model | ✅ | ❌ |
| Clear problem, unclear solution | ✅ | ❌ |
| Clear problem, clear solution | ❌ | ✅ |

---

## Example Session

```
Claude: "In one sentence, what do you need?"
User: "We need a way to... I don't know, make it easier to track customer feedback somehow?"

Claude: "Who's going to use this?"
User: "Our product team, I guess. When customers complain or suggest things."

Claude: "What do they do today?"
User: "Uh, spreadsheets? Slack messages? It's a mess."

Claude: "What's the ONE thing this must do?"
User: "See all feedback in one place, I think?"

Claude: "Any dealbreakers?"
User: "Don't make it complicated. They won't use it if it's complicated."

Claude: "Got it. Let me build something quick..."

[Builds simple HTML dashboard with fake feedback entries]

Claude: "Here's a rough version. Three feedback items, basic filters. What's your gut reaction?"

User: "Oh interesting... I like seeing them as cards. But I expected to see which customer said it."

Claude: "Got it—add customer names. What else feels off?"

User: "The categories feel wrong. We don't think in 'bug' vs 'feature.' We think in product areas."

Claude: "So group by product area instead. Like 'Checkout', 'Search', 'Mobile App'?"

User: "Yes! Exactly."

Claude: "Making those changes now..."

[Iteration continues until stakeholder approves]
```

---

*Generated by Claude Code Exploratory Prototype Prompt v1.0*
