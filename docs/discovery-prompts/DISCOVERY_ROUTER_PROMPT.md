# Discovery Router Prompt

> **For Claude Code — Automatic Scenario Detection & Routing**  
> Use this as your entry point. It detects which discovery approach fits and routes accordingly.

---

## 🎯 What This Prompt Does

Instead of guessing which discovery approach to use, this prompt:

1. **Asks diagnostic questions** to understand the situation
2. **Detects signals** that indicate which scenario applies
3. **Routes to the right prompt** automatically
4. **Switches approaches** if signals change mid-conversation
5. **Handles hybrid scenarios** that need multiple approaches

---

## The Four Scenarios

| Scenario | Prompt | When to Use |
|----------|--------|-------------|
| **A. Standard Discovery** | `NON_TECHNICAL_DISCOVERY_PROMPT.md` | Stakeholder knows what they want, can articulate requirements |
| **B. Exploratory** | `EXPLORATORY_PROTOTYPE_PROMPT.md` | "I'll know it when I see it", need to see options first |
| **C. Strategic Ambiguity** | `STRATEGIC_AMBIGUITY_PROMPT.md` | Political sensitivity, decisions above stakeholder's authority |
| **D. Integration-Heavy** | `INTEGRATION_DISCOVERY_PROMPT.md` | Success depends on existing system architecture |

---

## Decision Tree

```
                              START
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Ask Diagnostic       │
                    │  Questions (Phase 1)  │
                    └───────────────────────┘
                                │
                                ▼
            ┌───────────────────────────────────────┐
            │  Does this touch existing systems?    │
            └───────────────────────────────────────┘
                      │                    │
                     YES                   NO
                      │                    │
                      ▼                    ▼
        ┌─────────────────────┐    ┌─────────────────────┐
        │  ROUTE D:           │    │  Can stakeholder    │
        │  Integration        │    │  articulate what    │
        │  Discovery          │    │  they want?         │
        │  (+ Track A/B)      │    └─────────────────────┘
        └─────────────────────┘          │         │
                                        YES        NO
                                         │         │
                      ┌──────────────────┘         └──────────────────┐
                      ▼                                               ▼
        ┌─────────────────────┐                         ┌─────────────────────┐
        │  Are answers clear  │                         │  Is it "I don't     │
        │  or hedging/vague?  │                         │  know" or "I can't  │
        └─────────────────────┘                         │  say"?              │
              │           │                             └─────────────────────┘
           CLEAR       HEDGING                                │           │
              │           │                              DON'T KNOW    CAN'T SAY
              ▼           ▼                                   │           │
    ┌──────────────┐  ┌──────────────┐                       ▼           ▼
    │  ROUTE A:    │  │  ROUTE C:    │               ┌──────────────┐  ┌──────────────┐
    │  Standard    │  │  Strategic   │               │  ROUTE B:    │  │  ROUTE C:    │
    │  Discovery   │  │  Ambiguity   │               │  Exploratory │  │  Strategic   │
    └──────────────┘  └──────────────┘               │  Prototype   │  │  Ambiguity   │
                                                     └──────────────┘  └──────────────┘
```

---

## Phase 1: Diagnostic Questions

Ask these 5 questions to determine the right route. Watch for signals, not just answers.

### Question 1: The Opener

```
"Before we dive in, help me understand what we're working with. 
In a sentence or two, what are you trying to accomplish?"
```

**What to listen for:**

| Signal | Indicates |
|--------|-----------|
| Clear, specific answer | → Standard Discovery (A) |
| "I'm not exactly sure yet..." | → Exploratory (B) |
| "Well, it depends on..." + hedging | → Strategic Ambiguity (C) |
| "We need to connect to [system]..." | → Integration (D) |

---

### Question 2: Clarity Check

```
"How clear is this in your head? Would you say:
 a) I know exactly what I need, just need to document it
 b) I have a general idea but need to figure out details
 c) I'll know it when I see it—I need to see options
 d) It's complicated—there are factors I can't fully explain"
```

**Routing:**

| Answer | Route |
|--------|-------|
| (a) "I know exactly what I need" | → Standard Discovery (A) |
| (b) "General idea, need details" | → Standard Discovery (A), watch for drift to (B) or (C) |
| (c) "I'll know it when I see it" | → Exploratory (B) |
| (d) "It's complicated" | → Probe further, likely Strategic Ambiguity (C) |

---

### Question 3: System Dependencies

```
"Does this need to work with any existing systems, databases, or tools? 
Just names are fine—like 'Salesforce' or 'our customer database.'"
```

**Routing:**

| Answer | Route |
|--------|-------|
| "No, this is standalone" | → Continue with A, B, or C based on other signals |
| "Yes, it needs to connect to [X], [Y]..." | → Integration (D), potentially combined with A/B/C |
| "I think so, but I don't know the details" | → Integration (D) with technical discovery needed |

---

### Question 4: Decision Authority

```
"If we nail down requirements today, is there anyone else who'd need 
to approve before we could build? Or do you have the final say?"
```

**What to listen for:**

| Signal | Indicates |
|--------|-----------|
| "I can decide" / "My call" | → Proceed with A, B, or D |
| "I'd need to run it by [leadership]" | → Note, but may still be A/B/D |
| "That's being discussed at a higher level" | → Strategic Ambiguity (C) |
| "Different people have different opinions on that" | → Strategic Ambiguity (C) |
| Visible discomfort, hedging | → Probe gently for (C) |

---

### Question 5: The Constraint Check

```
"Is there anything that might limit what I can ask about or document? 
Any sensitivities I should know about?"
```

**What to listen for:**

| Signal | Indicates |
|--------|-----------|
| "Nope, ask anything" | → Open path to A, B, or D |
| "Well, there are some things still being figured out..." | → Strategic Ambiguity (C) |
| "Let's avoid [topic]" | → Strategic Ambiguity (C), respect the boundary |
| "I'd rather not put [X] in writing" | → Strategic Ambiguity (C) |

---

## Phase 2: Signal Detection

Throughout the conversation, continuously monitor for these signals:

### 🟢 Standard Discovery Signals (Route A)

```
✓ Clear, direct answers
✓ "I need X because Y"
✓ Can describe users and workflows
✓ Consistent answers when asked differently
✓ Comfortable with specifics
✓ "Let me tell you exactly what happens..."
```

**Confidence threshold:** If 4+ green signals, route to Standard Discovery.

---

### 🔵 Exploratory Signals (Route B)

```
✓ "I'll know it when I see it"
✓ "Can you show me some options?"
✓ "I'm not sure what's possible"
✓ "Let's just try something"
✓ "I haven't thought that far"
✓ Answers with questions: "Could it do X? Or maybe Y?"
✓ Excitement about possibilities, not requirements
✓ "What would you suggest?"
```

**Confidence threshold:** If 3+ blue signals, route to Exploratory.

---

### 🟡 Strategic Ambiguity Signals (Route C)

```
⚠ "That's still being discussed..."
⚠ "I can't really speak to that"
⚠ "It depends on factors outside my control"
⚠ "Let's not put that in writing"
⚠ "Different people have different views"
⚠ Long pauses before answering
⚠ "Officially, we'd say..." (implying unofficial differs)
⚠ "Between us..." / "Off the record..."
⚠ Answer changes when phrased differently
⚠ References to meetings/decisions happening elsewhere
⚠ Visible discomfort with certain topics
```

**Confidence threshold:** If 2+ yellow signals, probe gently. If 3+ confirmed, route to Strategic Ambiguity.

---

### 🟣 Integration Signals (Route D)

```
✓ Mentions specific systems by name
✓ "It needs to pull data from..."
✓ "It has to update [system] when..."
✓ "Talk to [dev] about how that works"
✓ "The old system does X"
✓ "I don't know how it's built, but..."
✓ "It needs to work with our existing..."
✓ References to APIs, databases, syncing
```

**Confidence threshold:** If 2+ purple signals, route to Integration (combined with A, B, or C for business requirements).

---

## Phase 3: Route Declaration

Once you've detected the scenario, declare the route clearly:

### Route A: Standard Discovery

```
"Great—it sounds like you have a clear picture of what you need. 
Let me interview you in detail to capture the requirements.

I'll ask about:
• The problem and why it matters
• Who uses this and how
• What success looks like
• Scope and priorities
• Edge cases and constraints

This usually takes 30-45 minutes. Ready to dive in?"
```

**Then follow:** `NON_TECHNICAL_DISCOVERY_PROMPT.md`

---

### Route B: Exploratory

```
"Got it—this is more of an 'I'll know it when I see it' situation. 
That's totally fine. Let's explore by building.

Here's how this works:
• I'll ask 5 quick questions (2 minutes)
• Then I'll build a rough prototype
• You react: what works, what doesn't
• We iterate until it clicks
• Then we'll document what we discovered

Sound good?"
```

**Then follow:** `EXPLORATORY_PROTOTYPE_PROMPT.md`

---

### Route C: Strategic Ambiguity

```
"I'm sensing there are some aspects of this that are still being 
worked out at a higher level—and that's okay. My goal isn't to 
force clarity where it doesn't exist yet.

Instead, let me help by:
• Documenting what IS clear (safe to build)
• Identifying what needs decisions
• Framing those decisions for leadership
• Protecting you from being pushed beyond your authority

I'll be careful about what goes in writing. Does that approach work?"
```

**Then follow:** `STRATEGIC_AMBIGUITY_PROMPT.md`

---

### Route D: Integration

```
"This touches existing systems, so we'll need two conversations:

**Today with you (business):**
• What you need and why
• Which systems are involved (names are enough)
• What success looks like for users

**Separately with your technical team:**
• How those systems actually work
• What APIs and data models exist
• Technical constraints and risks

I'll flag technical questions as we go—you won't need to answer those.
Then we'll merge both into a complete spec. Make sense?"
```

**Then follow:** `INTEGRATION_DISCOVERY_PROMPT.md` (Track A first)

---

## Phase 4: Hybrid Scenarios

Real projects often combine scenarios. Handle these combinations:

### Integration + Standard Discovery (D + A)

```
Stakeholder knows what they want + existing systems involved

Approach:
1. Run Integration Track A (business discovery)
2. Flag technical questions for Track B
3. Merge after technical session
```

---

### Integration + Exploratory (D + B)

```
"I'll know it when I see it" + existing systems involved

Approach:
1. Quick context (5 questions from Exploratory)
2. Build prototype using MOCKED integration points
3. Iterate on UX/flow with stakeholder
4. THEN do technical discovery for real integration
5. Update prototype with real constraints
```

---

### Integration + Strategic Ambiguity (D + C)

```
Political sensitivity + existing systems involved

Approach:
1. Map what systems are involved (names only)
2. Identify which integrations are politically sensitive
3. Document "safe" integrations vs. "pending decision" integrations
4. Escalate decisions about integration approach to leadership
5. Proceed with technical discovery only for approved integrations
```

---

### Exploratory → Standard Discovery (B → A)

```
Started exploratory, now stakeholder has clarity

Approach:
1. When stakeholder says "Yes, this is what I want"
2. Switch to Standard Discovery to document properly
3. Extract formal requirements from approved prototype
```

---

### Standard Discovery → Strategic Ambiguity (A → C)

```
Started clear, hit political walls

Approach:
1. When you detect ambiguity signals mid-interview
2. Acknowledge: "It sounds like this area might need input from others"
3. Document what's clear so far
4. Switch to Ambiguity framing for unclear parts
5. Generate split output: confirmed vs. needs-decision
```

---

## Phase 5: Mid-Conversation Switching

If signals change during the conversation, switch gracefully:

### Switching to Exploratory (→ B)

```
"I notice we're having trouble pinning down specifics—and that's okay. 
Would it help if I just built something rough and you react to it? 
Sometimes it's easier to say 'not that' than to describe what you want."
```

---

### Switching to Strategic Ambiguity (→ C)

```
"I'm picking up that some of these questions touch on things that 
are still being figured out. I don't want to put you in an awkward 
position. How about we document what's clear, and I'll frame the 
rest as decision points for leadership?"
```

---

### Switching to Integration (→ D)

```
"We keep bumping into questions about how [System X] works. 
That's totally fine—that's technical territory. Let me flag these 
for your dev team and we'll keep going with the business requirements."
```

---

### Switching to Standard Discovery (→ A)

```
"It sounds like you've got a much clearer picture now. Want to 
shift gears and document this properly? I can ask more structured 
questions to make sure we capture everything."
```

---

## Quick Reference Card

### Detection Cheat Sheet

| If you hear... | Route to... |
|----------------|-------------|
| "I need X so that Y" | A: Standard Discovery |
| "I'll know it when I see it" | B: Exploratory |
| "Show me options" | B: Exploratory |
| "That's still being discussed" | C: Strategic Ambiguity |
| "I can't really say" | C: Strategic Ambiguity |
| "It needs to work with [system]" | D: Integration |
| "Talk to [dev] about that" | D: Integration |
| "I know what I think, but..." | C: Strategic Ambiguity |
| "Let's just build something" | B: Exploratory |
| "Different people want different things" | C: Strategic Ambiguity |

---

### Route Summary

| Route | Time | Output | Best For |
|-------|------|--------|----------|
| A: Standard | 30-45 min | PRD.md + SPEC.json | Clear requirements |
| B: Exploratory | 5 min + iterations | Prototype → SPEC.json | Unclear vision |
| C: Ambiguity | 20-30 min | ESCALATION_BRIEF.md | Political complexity |
| D: Integration | 2 sessions | Merged SPEC.json | System dependencies |

---

## How to Use This Prompt

### In Claude Code

```bash
# Start every discovery session with the router
claude
> Read @DISCOVERY_ROUTER_PROMPT.md
> I need help figuring out requirements for a new project. 
> Ask me diagnostic questions to determine the best approach.

# Claude will:
# 1. Ask 5 diagnostic questions
# 2. Detect signals
# 3. Declare the route
# 4. Switch to the appropriate prompt
# 5. Adapt if signals change mid-conversation
```

### With Existing Context

```bash
# If you already have some context
claude
> Read @DISCOVERY_ROUTER_PROMPT.md
> Here's what I know so far: [context]
> Help me figure out the right discovery approach.
```

### For Teams

```bash
# Share this with product managers, analysts, etc.
# They can start with the router and it will guide them
# to the right approach based on their specific situation.
```

---

## Prompt File Locations

Ensure these files are available in your workspace:

```
/prompts/
├── DISCOVERY_ROUTER_PROMPT.md          ← This file (entry point)
├── NON_TECHNICAL_DISCOVERY_PROMPT.md   ← Route A
├── EXPLORATORY_PROTOTYPE_PROMPT.md     ← Route B
├── STRATEGIC_AMBIGUITY_PROMPT.md       ← Route C
└── INTEGRATION_DISCOVERY_PROMPT.md     ← Route D
```

---

## Example Session

```
Claude: "Before we dive in, help me understand what we're working with. 
        In a sentence or two, what are you trying to accomplish?"

User:   "We need a way for our support team to see customer orders faster. 
        Right now they dig through three different systems."

Claude: [Detects: clear problem + existing systems = likely Integration + Standard]

Claude: "Got it. How clear is this in your head—do you know exactly what 
        you need, or are you still figuring it out?"

User:   "Pretty clear. I've been dealing with complaints about this for months."

Claude: [Confirms: Standard Discovery clarity level]

Claude: "You mentioned three different systems. What are they called?"

User:   "Salesforce, our internal order database, and the shipping portal."

Claude: [Confirms: Integration scenario]

Claude: "If we document requirements today, can you approve them, or does 
        someone else need to sign off?"

User:   "I can decide on the support tool. But anything touching the order 
        database needs to go through IT governance."

Claude: [Detects: partial authority, some Strategic Ambiguity for DB changes]

Claude: "Any sensitivities I should know about?"

User:   "Not really, just the IT governance thing."

Claude: [Final assessment: Integration (D) + mostly Standard (A) + minor Ambiguity (C) for DB scope]

Claude: "Here's what I'm hearing:
        
        • You have a clear picture of what support needs (great!)
        • This touches Salesforce, order DB, and shipping portal
        • You can decide the support experience
        • DB changes need IT governance approval
        
        Let's do this:
        1. I'll interview you on the business requirements (what support needs)
        2. I'll flag technical questions about those systems for your dev team
        3. For anything touching the order DB, I'll frame it as a decision 
           point for IT governance
        
        Sound good?"

User:   "Perfect, let's do it."

Claude: [Proceeds with Integration Track A, flags technical questions, 
        notes DB scope as pending governance decision]
```

---

*Generated by Claude Code Discovery Router Prompt v1.0*
