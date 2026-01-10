# Discovery Prompt Suite for Claude Code

> **A complete framework for requirements gathering with non-technical stakeholders**  
> Automatically detects the right approach and guides you through it.

---

## 📁 Included Prompts

| File | Purpose | When to Use |
|------|---------|-------------|
| `DISCOVERY_ROUTER_PROMPT.md` | **Entry point** — Detects scenario, routes to right approach | Always start here |
| `NON_TECHNICAL_DISCOVERY_PROMPT.md` | Deep requirements interview | Stakeholder knows what they want |
| `EXPLORATORY_PROTOTYPE_PROMPT.md` | Build → React → Learn loop | "I'll know it when I see it" |
| `STRATEGIC_AMBIGUITY_PROMPT.md` | Document & escalate to leadership | Political/strategic sensitivity |
| `INTEGRATION_DISCOVERY_PROMPT.md` | Dual-track: Business + Technical | Existing systems involved |

---

## 🚀 Quick Start

### Option 1: Let Claude Route Automatically

```bash
claude
> Read @DISCOVERY_ROUTER_PROMPT.md
> I need help with requirements for a new project. Interview me.
```

Claude will ask 5 diagnostic questions, detect the scenario, and route to the right approach.

### Option 2: Go Direct (If You Know the Scenario)

```bash
# Clear requirements, no integrations
> Read @NON_TECHNICAL_DISCOVERY_PROMPT.md and interview me.

# "I'll know it when I see it"
> Read @EXPLORATORY_PROTOTYPE_PROMPT.md and start prototyping.

# Political complexity
> Read @STRATEGIC_AMBIGUITY_PROMPT.md and help me document what's unclear.

# Existing systems involved
> Read @INTEGRATION_DISCOVERY_PROMPT.md — I'm the business stakeholder (Track A).
```

---

## 🔀 Decision Flow

```
                         START HERE
                              │
                              ▼
                    ┌─────────────────┐
                    │   ROUTER        │
                    │   (5 questions) │
                    └─────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   ┌───────────┐        ┌───────────┐        ┌───────────┐
   │ Standard  │        │ Exploratory│       │ Ambiguity │
   │ Discovery │        │ Prototype │        │ Escalation│
   │    (A)    │        │    (B)    │        │    (C)    │
   └───────────┘        └───────────┘        └───────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    ┌─────────────────┐
                    │  INTEGRATION?   │
                    │  (combines with │
                    │   any above)    │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │    SPEC.json    │
                    │  (for Ralph     │
                    │   Wiggum)       │
                    └─────────────────┘
```

---

## 📊 Scenario Detection Signals

### Route A: Standard Discovery
- Clear, direct answers
- "I need X because Y"
- Can describe users and workflows
- Comfortable with specifics

### Route B: Exploratory
- "I'll know it when I see it"
- "Show me options"
- "I'm not sure what's possible"
- Answers with questions

### Route C: Strategic Ambiguity
- "That's still being discussed..."
- "I can't really speak to that"
- "Different people have different views"
- Hedging, discomfort, long pauses

### Route D: Integration
- Mentions specific systems
- "Needs to work with [existing tool]"
- "Talk to [dev] about how that works"
- References to APIs, databases, syncing

---

## 📄 Output Files

Each prompt generates files ready for development:

| Prompt | Output Files |
|--------|--------------|
| Standard Discovery | `PRD.md`, `SPEC.json` |
| Exploratory | `DISCOVERY_LOG.md`, `EXTRACTED_REQUIREMENTS.md`, `SPEC.json` |
| Strategic Ambiguity | `ESCALATION_BRIEF.md`, `AMBIGUITY_MAP.md`, `SAFE_TO_BUILD.json` |
| Integration | `BUSINESS_REQUIREMENTS.md`, `TECHNICAL_DISCOVERY.md`, `SPEC.json` |

---

## 🔧 Integration with Ralph Wiggum

All prompts generate `SPEC.json` compatible with Ralph Wiggum:

```bash
# After discovery completes
/ralph-wiggum:ralph-loop "Implement @SPEC.json. 
Mark passes: true when acceptance_criteria verified." \
--max-iterations 50
```

### SPEC.json Structure

```json
{
  "project": { "name": "...", "status": "ready-for-development" },
  "features": [
    {
      "id": "US-1",
      "priority": "must-have",
      "user_story": "As a [user], I want [feature] so that [benefit]",
      "acceptance_criteria": ["When [X], then [Y]"],
      "passes": false,
      "technical_notes": "..."
    }
  ]
}
```

---

## 🎯 Best Practices

### For Non-Technical Stakeholders

1. **Start with the router** — Don't guess which approach fits
2. **Answer naturally** — Stories are better than formal requirements
3. **"I don't know" is valid** — We'll note it as an open question
4. **Review the PRD** — You'll see plain-English output to verify

### For Facilitators

1. **Watch for signal changes** — Be ready to switch approaches mid-conversation
2. **Respect political boundaries** — Don't push when you sense ambiguity
3. **Flag technical questions** — Don't expect business stakeholders to know architecture
4. **Timebox sessions** — 30-45 min for discovery, shorter for exploratory

### For Developers

1. **Review SPEC.json** — Add technical test cases before Ralph execution
2. **Do Track B for integrations** — Business requirements alone aren't enough
3. **Check "passes": false** — These are your completion gates
4. **Update technical_notes** — Add implementation details

---

## 📋 Session Checklist

### Before Discovery Session

- [ ] Router prompt loaded
- [ ] Stakeholder knows it's 30-45 min
- [ ] Technical contact identified (for integration projects)
- [ ] Workspace ready for output files

### During Session

- [ ] Asked diagnostic questions
- [ ] Detected and declared route
- [ ] Watched for signal changes
- [ ] Flagged technical questions (if integration)
- [ ] Confirmed understanding throughout

### After Session

- [ ] Generated output files
- [ ] Stakeholder reviewed PRD.md
- [ ] Technical questions sent to dev team (if needed)
- [ ] SPEC.json ready for development
- [ ] Escalation sent to leadership (if ambiguity)

---

## 🔄 Workflow Examples

### Example 1: Simple Feature (Route A)

```
Session: 35 minutes with Product Manager

Output:
├── PRD.md (stakeholder approved)
└── SPEC.json (ready for Ralph)

Next: Developer reviews, adds tests, runs Ralph
```

### Example 2: Exploratory Project (Route B)

```
Session 1: 5 min context + 3 prototype iterations (45 min)
Session 2: (if needed) 2 more iterations (20 min)

Output:
├── DISCOVERY_LOG.md
├── EXTRACTED_REQUIREMENTS.md
└── SPEC.json

Next: Developer reviews prototype + spec, runs Ralph
```

### Example 3: Political Complexity (Route C)

```
Session: 30 minutes with stakeholder

Output:
├── ESCALATION_BRIEF.md → sent to leadership
├── AMBIGUITY_MAP.md
└── SAFE_TO_BUILD.json (unambiguous scope only)

Next: Wait for leadership decisions, then full spec
```

### Example 4: Integration Project (Route D)

```
Session 1: 40 min with Business Stakeholder (Track A)
Session 2: 45 min with Developer (Track B)
Merge: 15 min to combine

Output:
├── BUSINESS_REQUIREMENTS.md
├── TECHNICAL_DISCOVERY.md
└── SPEC.json (merged)

Next: Run Ralph with full integration context
```

---

## 🛠 Setup Instructions

### 1. Copy All Prompts to Your Workspace

```bash
mkdir -p /your/project/prompts

# Copy all prompt files
cp DISCOVERY_ROUTER_PROMPT.md /your/project/prompts/
cp NON_TECHNICAL_DISCOVERY_PROMPT.md /your/project/prompts/
cp EXPLORATORY_PROTOTYPE_PROMPT.md /your/project/prompts/
cp STRATEGIC_AMBIGUITY_PROMPT.md /your/project/prompts/
cp INTEGRATION_DISCOVERY_PROMPT.md /your/project/prompts/
```

### 2. Start Discovery Session

```bash
cd /your/project
claude
> Read @prompts/DISCOVERY_ROUTER_PROMPT.md and begin.
```

### 3. Generate Outputs

Outputs will be created in your current directory:
- `PRD.md`
- `SPEC.json`
- etc.

---

## 📝 Customization

### Adding Company-Specific Questions

Edit any prompt file and add questions under the appropriate category:

```markdown
### Category X: [Your Custom Category]

Example questions:
- "Your custom question here?"
- "Another custom question?"
```

### Modifying Output Formats

Edit the output templates in each prompt to match your team's conventions:

```markdown
#### File 1: PRD.md

[Modify this template to match your PRD format]
```

### Adding New Routes

1. Create a new prompt file: `YOUR_SCENARIO_PROMPT.md`
2. Add detection signals to `DISCOVERY_ROUTER_PROMPT.md`
3. Add routing logic to the decision tree

---

## 📚 Additional Resources

- [Ralph Wiggum Documentation](https://github.com/your-org/ralph-wiggum)
- [Claude Code Best Practices](https://docs.anthropic.com/claude-code)
- [AskUserQuestionTool Guide](https://docs.anthropic.com/ask-user-question)

---

## 📦 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01 | Initial release with 5 prompts |

---

*Generated by Claude Code Discovery Prompt Suite v1.0*
