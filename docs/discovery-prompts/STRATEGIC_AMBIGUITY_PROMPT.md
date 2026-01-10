# Strategic Ambiguity Prompt

> **For Claude Code — When Requirements Are Intentionally Vague**  
> Use this when ambiguity is political/strategic, not accidental. Documents what's unclear and escalates to leadership.

---

## 🎯 When to Use This Prompt

Use this when you detect these patterns:

| Signal | What It Usually Means |
|--------|----------------------|
| "That's still being discussed at the leadership level" | Decision authority sits higher |
| "I can't really speak to that" | Political boundaries |
| "It depends on factors outside my control" | External dependencies or negotiations |
| "Let's not put that in writing" | Sensitive positioning |
| "We need to stay flexible on that" | Deliberate ambiguity for strategic reasons |
| "I'd rather not commit to that yet" | Waiting on other decisions |
| Vague answers that stay vague after 2-3 follow-ups | Not lack of knowledge—lack of authority |
| Different stakeholders give contradictory answers | Unresolved internal disagreement |
| Scope keeps shifting based on "conversations happening" | Active negotiation elsewhere |

**This prompt is NOT for:**
- Stakeholders who are confused (use Discovery Prompt)
- Stakeholders exploring ideas (use Exploratory Prompt)
- Legitimate uncertainty that can be resolved with more research

**This prompt IS for:**
- Political navigation required
- Decisions above stakeholder's pay grade
- Competitive or strategic sensitivity
- Unresolved internal conflicts
- Deliberate flexibility that shouldn't be locked down

---

## 🚨 Core Principle: Expose, Don't Resolve

Your job is to:
1. **Document** what IS clear vs. what ISN'T
2. **Identify** the specific ambiguities blocking progress
3. **Frame** decision points for leadership
4. **Protect** the stakeholder from being pushed beyond their authority
5. **Escalate** with a clear briefing package

Your job is NOT to:
- Force clarity where it's intentionally absent
- Make the stakeholder uncomfortable
- Resolve political issues through clever questioning
- Commit anyone to positions they're avoiding

---

## Interview Instructions for Claude

### Phase 1: Establish What's Clear (The Safe Zone)

Start by mapping the uncontroversial territory. These answers should come easily.

```
"Let's start with what we know for sure. What's the high-level goal everyone agrees on?"

"Who are the definite users? The ones that aren't up for debate?"

"What are the absolute constraints? Budget, timeline, technical limits that are fixed?"

"Is there a minimum viable version that's uncontroversial—something small everyone would agree on?"
```

**Document clearly:**
```markdown
## ✅ Confirmed (Safe to Build)
- [Unambiguous requirement]
- [Agreed constraint]
- [Clear user/scope]
```

---

### Phase 2: Probe the Edges (Find the Ambiguity)

Now gently explore where clarity breaks down. Watch for hedging, deflection, or discomfort.

```
"What aspects are still being figured out?"

"Are there parts of this where different people might have different expectations?"

"What decisions are you waiting on before this can be fully defined?"

"Is there anything where you'd say 'I know what I think, but I can't commit to that'?"

"If I asked [other stakeholder/leader] the same question, might I get a different answer?"
```

**Ambiguity detection signals:**
- Long pauses before answering
- "Good question..." followed by non-answer
- "Officially, we'd say..." (implies unofficial reality differs)
- "Between us..." or "Off the record..."
- Answer changes when you ask it differently
- "I don't want to step on anyone's toes"
- References to ongoing discussions/meetings

---

### Phase 3: Classify the Ambiguity

For each unclear area, determine WHY it's unclear:

| Type | Pattern | Example |
|------|---------|---------|
| **Decision Pending** | Waiting on specific decision from leadership | "We'll know after the board meeting" |
| **Political Sensitivity** | Multiple stakeholders with competing interests | "Sales wants X, Product wants Y" |
| **Strategic Flexibility** | Intentionally keeping options open | "We don't want to commit until we see competitor response" |
| **Authority Gap** | Stakeholder doesn't have power to decide | "That's above my pay grade" |
| **External Dependency** | Waiting on partner, customer, regulatory input | "Depends on what the client says" |
| **Unspoken Conflict** | Disagreement exists but isn't being surfaced | Contradictory requirements from different people |

**Ask clarifying questions:**
```
"Is this unclear because we don't know yet, or because a decision hasn't been made yet?"

"Who would need to weigh in to resolve this?"

"Is this something that SHOULD be decided now, or is the ambiguity intentional?"

"If you had to guess—and this is just your read—which way is this likely to go?"
```

---

### Phase 4: Frame Decision Points for Leadership

For each ambiguity, create a clear decision frame:

```markdown
## Decision Required: [Topic]

**Current State:** [What's ambiguous]

**Why It Matters:** [Impact on project if left unresolved]

**Options:**
- **Option A:** [Choice 1] → Implications: [what this means]
- **Option B:** [Choice 2] → Implications: [what this means]
- **Option C:** [Defer decision] → Risk: [what could go wrong]

**Stakeholder Input:** "[What they said, if comfortable sharing]"

**Deadline for Decision:** [When this blocks progress]

**Who Needs to Decide:** [Role/name if known]
```

---

### Phase 5: Confirm Escalation Approach

Before generating documents, confirm with stakeholder:

```
"I've identified [N] areas that seem to need leadership input before we can proceed. 
Is it okay if I document these as decision points for escalation?"

"Is there anything we discussed that should NOT go in the escalation document?"

"Who should this escalation go to? Is there a preferred format or channel?"

"Are there any sensitivities I should be aware of in how this is framed?"
```

**Respect boundaries:**
- If they say "don't include X," don't include it
- If they seem uncomfortable, offer to let them review before sharing
- Never put someone in a position where they're documented saying something they shouldn't

---

## Output Documents

### File 1: ESCALATION_BRIEF.md

Executive summary for leadership—clear, actionable, non-judgmental.

```markdown
# Escalation Brief: [Project Name]

**Date:** [Date]  
**Prepared by:** [Claude/Analyst]  
**Stakeholder Consulted:** [Name/Role]  
**Purpose:** Leadership decisions required to proceed

---

## Executive Summary

[Project name] cannot proceed to development until [N] strategic decisions are made. 
This brief outlines what is confirmed, what is ambiguous, and the specific decisions required.

**Bottom Line:** [One sentence on what's needed to unblock]

---

## ✅ What's Confirmed (Ready to Build)

These elements are clear and uncontroversial:

| Area | Confirmed Requirement |
|------|----------------------|
| Goal | [Clear objective] |
| Users | [Defined users] |
| Constraints | [Fixed limitations] |
| Minimum Scope | [Uncontroversial baseline] |

**Recommendation:** Development could begin on this baseline while decisions are pending.

---

## ⚠️ Decisions Required

### Decision 1: [Topic]

**The Ambiguity:**  
[Clear description of what's unclear]

**Why It Matters:**  
[Business impact, timeline risk, or dependency]

**Options:**

| Option | Description | Implications |
|--------|-------------|--------------|
| A | [Choice] | [Tradeoffs] |
| B | [Choice] | [Tradeoffs] |
| C | Defer | [Risks of waiting] |

**Decision Owner:** [Who needs to decide]  
**Decision Deadline:** [When this blocks progress]

---

### Decision 2: [Topic]

[Same format]

---

### Decision 3: [Topic]

[Same format]

---

## 🚦 Recommended Path Forward

**Option 1: Decide Now**  
Resolve decisions [1, 2, 3] and proceed to full development.

**Option 2: Parallel Track**  
- Begin development on confirmed scope (baseline)
- Decisions [1, 2] addressed in parallel
- Integration point at [milestone] when decisions are made

**Option 3: Pause**  
Hold project until [specific blocker] is resolved.

---

## Appendix: Stakeholder Input

> *The following reflects input from [stakeholder]. Shared with their permission.*

[Optional: Include relevant quotes or context if stakeholder approved]

---

**Next Steps:**
- [ ] Leadership reviews decision points
- [ ] Decisions communicated by [date]
- [ ] Stakeholder notified of outcomes
- [ ] Development proceeds based on decisions
```

---

### File 2: AMBIGUITY_MAP.md

Detailed documentation for project record.

```markdown
# Ambiguity Map: [Project Name]

**Purpose:** Document strategic ambiguities for project record and future reference.

---

## Confirmed Requirements

### Users
- ✅ [Confirmed user group]
- ✅ [Confirmed user group]
- ⚠️ [User group TBD pending decision]

### Scope
- ✅ [Confirmed in-scope item]
- ✅ [Confirmed in-scope item]
- ⚠️ [Scope item dependent on Decision #1]
- ❌ [Confirmed out-of-scope]

### Constraints
- ✅ Budget: [Confirmed]
- ✅ Timeline: [Confirmed]
- ⚠️ Technical approach: [Pending Decision #2]

---

## Ambiguity Analysis

### Ambiguity #1: [Topic]

| Attribute | Detail |
|-----------|--------|
| **Type** | [Decision Pending / Political / Strategic / Authority Gap / External] |
| **Description** | [What's unclear] |
| **Root Cause** | [Why it's unclear] |
| **Stakeholder Quote** | "[What they said]" |
| **Impact if Unresolved** | [Consequence] |
| **Resolution Owner** | [Who can resolve] |
| **Estimated Resolution** | [Timeline if known] |

### Ambiguity #2: [Topic]

[Same format]

---

## Dependency Map

```
[Decision #1] ──► [Feature A, Feature B]
[Decision #2] ──► [Technical Architecture]
[Decision #3] ──► [User Scope]
```

---

## Interview Notes

**Session Date:** [Date]  
**Stakeholder:** [Name/Role]  
**Duration:** [Time]

### Questions Asked & Responses

| Question | Response | Classification |
|----------|----------|----------------|
| [Question] | [Summary] | ✅ Clear |
| [Question] | [Summary] | ⚠️ Ambiguous |
| [Question] | [Summary] | 🚫 Declined to answer |

### Observations

- [Pattern noticed]
- [Sensitivity detected]
- [Recommendation based on interview]

---

## Changelog

| Date | Update | By |
|------|--------|-----|
| [Date] | Initial ambiguity map created | [Name] |
| [Date] | Decision #1 resolved: [outcome] | [Name] |
```

---

### File 3: SAFE_TO_BUILD.json

For development—ONLY the unambiguous parts.

```json
{
  "project": {
    "name": "Project Name",
    "status": "partial-requirements",
    "escalation_pending": true,
    "created": "YYYY-MM-DD"
  },
  "confirmed_scope": {
    "description": "Baseline scope that is unambiguous and safe to build",
    "features": [
      {
        "id": "SAFE-1",
        "user_story": "As a [confirmed user], I want [unambiguous feature]",
        "acceptance_criteria": ["Clear, uncontroversial criteria"],
        "status": "approved",
        "passes": false
      }
    ]
  },
  "blocked_scope": {
    "description": "Features blocked pending leadership decisions",
    "features": [
      {
        "id": "BLOCKED-1",
        "user_story": "As a [user], I want [ambiguous feature]",
        "blocked_by": "Decision #1",
        "status": "pending-decision",
        "passes": false
      }
    ]
  },
  "decisions_required": [
    {
      "id": "DEC-1",
      "topic": "Decision topic",
      "options": ["Option A", "Option B"],
      "owner": "Leadership role",
      "deadline": "YYYY-MM-DD",
      "blocks": ["BLOCKED-1", "BLOCKED-2"]
    }
  ]
}
```

---

## Conversation Patterns

### When Stakeholder Hedges

**They say:** "It's complicated..."  
**You say:** "I understand. Can you help me understand which parts are settled and which parts are still in flux?"

**They say:** "I'd rather not get into that..."  
**You say:** "Totally fine. I'll just note that as an area needing leadership input. Is there a way you'd like me to frame it?"

**They say:** "Different people have different views..."  
**You say:** "That's helpful to know. Should I document this as a decision point that needs alignment?"

### When Stakeholder Is Uncomfortable

**They say:** "I don't want to create problems..."  
**You say:** "I get it. My goal is just to document what's clear vs. what needs decisions—not to create conflict. Want to review the doc before it goes anywhere?"

**They say:** "Can we keep this between us?"  
**You say:** "Of course. What would you like me to include vs. leave out of the escalation?"

### When Authority Is Unclear

**They say:** "I'm not sure who decides that..."  
**You say:** "No problem. I'll flag it as needing an owner. Any guess who might know?"

---

## Red Flags: When to Stop the Interview

🛑 **Stop and escalate immediately if:**
- Stakeholder becomes visibly distressed
- You're being asked to document something that feels deceptive
- Legal or compliance concerns are raised
- You sense you're being used to advance one side of a political battle
- The stakeholder says "I shouldn't be telling you this"

**What to say:**
```
"I want to make sure we're handling this appropriately. 
It sounds like there may be sensitivities beyond what I should be documenting. 
Would it be better to pause and loop in [leadership/appropriate party]?"
```

---

## Example Escalation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Interview reveals strategic ambiguity                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Classify: Decision Pending / Political / Strategic / etc.     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Document: Confirmed vs. Ambiguous                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Frame decision points with options                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Stakeholder reviews escalation doc                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ESCALATION_BRIEF.md sent to leadership                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
         ┌──────────────────────┴───────────────────────┐
         ↓                                              ↓
┌─────────────────────┐                    ┌─────────────────────┐
│  Decisions Made     │                    │  Decisions Deferred │
│  → Update SPEC.json │                    │  → Build safe scope │
│  → Proceed          │                    │  → Wait on blocked  │
└─────────────────────┘                    └─────────────────────┘
```

---

## Prompt Selection Guide

| Situation | Prompt to Use |
|-----------|---------------|
| Stakeholder knows what they want | Discovery Prompt |
| "I'll know it when I see it" | Exploratory Prompt |
| Vague answers + political signals | **Strategic Ambiguity Prompt** |
| Clear requirements, ready to build | Skip to SPEC.json |

---

## How to Use in Claude Code

```bash
# When you detect strategic ambiguity
claude
> Read @STRATEGIC_AMBIGUITY_PROMPT.md
> Interview me, but watch for areas where I can't give clear answers.
> Document what's confirmed vs. what needs leadership decisions.
> Generate an escalation brief I can share with leadership.
```

---

*Generated by Claude Code Strategic Ambiguity Prompt v1.0*
