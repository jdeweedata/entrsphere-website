# Non-Technical Discovery Interview Prompt

> **For Claude Code / AskUserQuestionTool**  
> Use this prompt to interview non-technical stakeholders and generate PRD + SPEC files for development.

---

## 🎯 Before We Start: What to Expect

**Welcome!** I'm going to ask you questions to understand what you want to build. Think of this like a friendly conversation—not a technical interview.

### Here's how this works:

1. **I ask simple questions, you tell me stories**  
   I'll ask things like "Walk me through what happens when..." and you just describe it in your own words. No right or wrong answers.

2. **You don't need technical knowledge**  
   I won't ask about databases, code, or architecture. If I accidentally use jargon, just say "Can you ask that in plain English?" and I'll rephrase.

3. **Think about WHAT you need, not HOW to build it**  
   Your job is to describe the problem and what success looks like. The development team figures out the technical "how" later.

4. **It's okay to say "I don't know"**  
   Some questions might need input from others. We'll note those as open questions.

5. **I'll summarize as we go**  
   After your answers, I'll often say "So what I'm hearing is..." to make sure I understood correctly. Just correct me if I got it wrong.

### What we'll cover (roughly 30-45 minutes):

| Topic | What I'll Ask About |
|-------|---------------------|
| 🎯 The Problem | What's broken today? Why does it matter? |
| 👥 The People | Who will use this? What's their day like? |
| 🚶 The Journey | Walk me through how it should work |
| ✂️ The Scope | What's essential vs. nice-to-have? |
| ⚠️ The Gotchas | What could go wrong? Any rules to follow? |

### What you'll get at the end:

- **PRD.md** — A plain-English document describing what we're building (you'll review this)
- **SPEC.json** — A structured file the development team uses (you don't need to read this)

---

**Ready? Let's start with the easy stuff.**

---

## Interview Instructions for Claude

Read any existing @SPEC.md or @PRD.md if provided. Then conduct a discovery interview using the AskUserQuestionTool following these guidelines:

### Interview Flow

Work through each category below. Ask ONE question at a time. Wait for an answer before continuing.

---

### Category 1: The Problem & Why It Matters

**Goal:** Understand the core problem and business justification.

Example questions (adapt based on context):
- "In a sentence or two, what's the main problem we're trying to solve?"
- "Who has this problem? How often do they run into it?"
- "What happens today when someone hits this problem? What do they do as a workaround?"
- "Why is now the right time to fix this? What's the cost of doing nothing?"
- "If this works perfectly, what changes for the business or users?"

**Dig deeper with:**
- "Can you give me a specific example of when this happened?"
- "How bad is this problem on a scale of 'minor annoyance' to 'showstopper'?"

---

### Category 2: The People Who'll Use This

**Goal:** Build a clear picture of users and their context.

Example questions:
- "Who exactly will use this? Describe them like you're telling a friend."
- "Are there different types of users? (e.g., admins vs. regular users)"
- "What's a typical day like for them? When would they reach for this tool?"
- "How tech-savvy are they? Do they love new software or dread it?"
- "What tools do they already use that this might replace or work with?"

**Dig deeper with:**
- "Walk me through the last time someone tried to do this task."
- "What frustrates them most about the current way?"

---

### Category 3: How It Should Work (The User's Journey)

**Goal:** Map out the experience from the user's perspective, step by step.

Example questions:
- "Let's walk through the ideal experience. Where does the user start?"
- "What do they see first? What action do they take?"
- "And then what happens next?"
- "At what point do they know it worked? What does 'done' look like?"
- "What should happen if something goes wrong? (e.g., bad input, no results)"

**Dig deeper with:**
- "Is there anything they need to do before this step?"
- "What information do they need to see at this point?"
- "How quickly should this happen? Instant? Okay to wait a few seconds?"

---

### Category 4: What's In vs. What's Out

**Goal:** Define scope and priorities clearly.

Example questions:
- "If you had only 2 weeks and limited resources, what absolutely must work for launch?"
- "What would be nice to have but could wait for version 2?"
- "Is there anything people might expect that we're definitely NOT building?"
- "If you had to cut 30% of what we discussed, what would you keep?"
- "Are there any related features we should explicitly set aside for later?"

**Dig deeper with:**
- "Why is [feature] a must-have vs. nice-to-have?"
- "What happens if we launch without [feature]?"

---

### Category 5: Guardrails, Rules & Edge Cases

**Goal:** Uncover constraints, compliance needs, and unusual scenarios.

Example questions:
- "Are there any company rules or regulations this needs to follow?"
- "Who should NOT be able to access or use this? Any permission levels?"
- "What's the weirdest or most unusual situation a user might encounter?"
- "Are there any deadlines, budget limits, or technical constraints I should know about?"
- "What happens if someone tries to misuse this or makes a mistake?"
- "What questions do you still have that we'd need to figure out?"

**Dig deeper with:**
- "Has something like this ever gone wrong before? What happened?"
- "Are there legal, security, or privacy concerns?"

---

### Interview Guidelines

**DO:**
- ✅ Ask ONE clear question at a time
- ✅ Use everyday language—no jargon
- ✅ Encourage storytelling: "Walk me through...", "Tell me about a time..."
- ✅ Confirm understanding: "So what I'm hearing is..."
- ✅ Ask follow-ups: "Can you give me a specific example?"
- ✅ Note when they say "I don't know"—add to open questions
- ✅ Be encouraging: "That's really helpful" / "Good example"

**DON'T:**
- ❌ Ask about databases, APIs, architecture, or code
- ❌ Ask about UI frameworks, state management, or technical tradeoffs
- ❌ Ask multiple questions at once
- ❌ Use acronyms without explaining them
- ❌ Rush—let them think and elaborate
- ❌ Make them feel dumb for not knowing technical details

---

### When the Interview is Complete

Generate TWO files:

---

#### File 1: PRD.md (Product Requirements Document)

Write this in plain English that anyone can understand. The stakeholder will review this.

```markdown
# [Feature/Project Name]

## Summary
[2-3 sentence plain-English description of what we're building and why]

## Problem Statement
[What problem are we solving? Who has it? What's the impact?]

## Target Users
[Who will use this? Brief description of their context and needs]

## User Stories

### Must-Have (Launch Blockers)
- **US-1:** As a [user type], I want to [action] so that [benefit]
  - ✓ When [condition], then [expected outcome]
  - ✓ When [condition], then [expected outcome]

- **US-2:** As a [user type], I want to [action] so that [benefit]
  - ✓ When [condition], then [expected outcome]

### Nice-to-Have (Post-Launch)
- **US-3:** As a [user type], I want to [action] so that [benefit]

## Success Criteria
How we'll know this is working:
- [ ] [Measurable outcome]
- [ ] [Measurable outcome]
- [ ] [Measurable outcome]

## Out of Scope
What we're explicitly NOT building:
- [Exclusion 1]
- [Exclusion 2]

## Constraints & Rules
- [Any compliance, security, or business rules]
- [Permission/access requirements]

## Open Questions
Things we still need to figure out:
- [ ] [Question 1]
- [ ] [Question 2]

## Stakeholder Sign-off
- [ ] Reviewed by: _____________ Date: _______
```

---

#### File 2: SPEC.json (Development Specification)

Generate structured JSON for the development team and Ralph Wiggum automation.

```json
{
  "project": {
    "name": "Feature Name",
    "summary": "Plain English description",
    "created": "YYYY-MM-DD",
    "stakeholder": "Name if provided",
    "status": "discovery-complete"
  },
  "users": [
    {
      "type": "primary",
      "persona": "User description",
      "context": "When/why they use this"
    }
  ],
  "features": [
    {
      "id": "US-1",
      "priority": "must-have",
      "user_story": "As a [user], I want [feature] so that [benefit]",
      "acceptance_criteria": [
        "When [condition], then [expected outcome]",
        "When [condition], then [expected outcome]"
      ],
      "edge_cases": [
        "What if [unusual scenario]?"
      ],
      "passes": false,
      "technical_notes": "FOR DEV TEAM: Add implementation details and test cases here"
    },
    {
      "id": "US-2",
      "priority": "nice-to-have",
      "user_story": "As a [user], I want [feature] so that [benefit]",
      "acceptance_criteria": [
        "When [condition], then [expected outcome]"
      ],
      "edge_cases": [],
      "passes": false,
      "technical_notes": "FOR DEV TEAM: Add implementation details here"
    }
  ],
  "constraints": {
    "business_rules": ["Rule 1", "Rule 2"],
    "permissions": ["Who can access what"],
    "compliance": ["Any regulatory requirements"]
  },
  "out_of_scope": [
    "Explicit exclusion 1",
    "Explicit exclusion 2"
  ],
  "open_questions": [
    "Unresolved question 1",
    "Unresolved question 2"
  ],
  "success_metrics": [
    "Measurable outcome 1",
    "Measurable outcome 2"
  ]
}
```

---

## How to Use This Prompt

### In Claude Code:

```bash
# Start a new discovery session
claude

# Then paste or reference this prompt:
> Read @NON_TECHNICAL_DISCOVERY_PROMPT.md and begin interviewing me.
> Start with the warm-up explanation, then work through each category.

# Or if you have an existing spec to refine:
> Read @NON_TECHNICAL_DISCOVERY_PROMPT.md and @SPEC.md
> Interview me to fill in gaps and clarify requirements.
```

### Workflow Integration:

```
┌─────────────────────────────────────────────────────────────────┐
│  Phase 1: Discovery (This Prompt)                               │
│  • Non-technical stakeholder interview                          │
│  • Output: PRD.md + SPEC.json                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Phase 2: Technical Enhancement                                  │
│  • Developer reviews SPEC.json                                  │
│  • Adds test cases to "technical_notes"                         │
│  • Adds implementation details                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Phase 3: Ralph Wiggum Execution                                │
│  • Autonomous implementation                                     │
│  • Tests against acceptance_criteria                            │
│  • Marks "passes": true when complete                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tips for Stakeholders

### Before the session:
- Think about a recent time you (or users) struggled with this problem
- Have examples ready—specific stories are more helpful than general statements
- It's okay to not have all the answers

### During the session:
- Talk like you're explaining to a friend, not writing a formal document
- "I don't know" is a valid answer—we'll note it as an open question
- If a question doesn't make sense, ask for clarification

### After the session:
- Review the PRD.md to make sure it captures what you meant
- Flag anything that seems wrong or missing
- The dev team will handle the technical SPEC.json

---

## Quick Reference: Good vs. Not-So-Good Answers

| Question | Not-So-Good Answer | Better Answer |
|----------|-------------------|---------------|
| "Who uses this?" | "Various stakeholders" | "Our 12 customer service reps who handle phone calls" |
| "What's the problem?" | "It's inefficient" | "Reps spend 3-4 minutes looking up orders across 3 different systems while customers wait on hold" |
| "Walk me through it" | "They search and find results" | "They type in the order number, hit search, see the status and tracking info, then tell the customer" |
| "What if it fails?" | "Show an error" | "If the order doesn't exist, show 'Order not found' with a suggestion to double-check the number" |

---

*Generated by Claude Code Discovery Interview Prompt v1.0*
