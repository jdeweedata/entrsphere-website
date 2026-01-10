# Discovery Red Flags

## Organizational Red Flags

### No Clear Decision Maker
**Signal**: "We'll need to run that by..." (multiple people, unclear hierarchy)
**Risk**: Decision paralysis, endless revision cycles
**Action**: Map the decision-making process explicitly before continuing

### History of Failed Projects
**Signal**: "We tried something like this before..."
**Risk**: Organizational scar tissue, hidden blockers
**Action**: Understand what went wrong, what's different this time

### Misaligned Incentives
**Signal**: Different stakeholders have conflicting success metrics
**Risk**: Building something that succeeds for no one
**Action**: Surface the conflict, align on shared success criteria

### IT/Business Disconnect
**Signal**: Business doesn't understand technical constraints; IT doesn't understand business needs
**Risk**: Scope that's technically impossible or business-irrelevant
**Action**: Bridge the gap early, get both in the room

---

## Technical Red Flags

### "The API Can Do Anything"
**Signal**: Assumed capabilities without verification
**Risk**: Integration surprises late in development
**Action**: Verify API capabilities with documentation or testing

### Legacy System Dependencies
**Signal**: Core functionality depends on old, undocumented systems
**Risk**: Unknown unknowns, tribal knowledge dependencies
**Action**: Map dependencies, identify risks, build contingencies

### No Sandbox Environment
**Signal**: Can only test in production
**Risk**: Can't validate integrations safely
**Action**: Establish testing strategy before development

### Data Quality Issues
**Signal**: "The data is a bit messy"
**Risk**: Garbage in, garbage out
**Action**: Assess data quality, plan for cleanup

---

## Process Red Flags

### No Budget Discussion
**Signal**: Avoiding concrete numbers
**Risk**: Misaligned expectations, project cancellation
**Action**: Get to a range, even if rough

### Unrealistic Timeline
**Signal**: "We need this in 2 weeks" (for 2-month project)
**Risk**: Cutting corners, technical debt, burnout
**Action**: Reality-check the timeline, negotiate scope

### Specification by Committee
**Signal**: Every meeting adds new stakeholders
**Risk**: Infinite requirements, no ownership
**Action**: Establish core team, limit input sources

### "Just Make It Work"
**Signal**: Resistance to documentation or planning
**Risk**: Building the wrong thing, scope disputes
**Action**: Explain value of discovery, get minimum commitment

---

## Communication Red Flags

### Inconsistent Answers
**Signal**: Same question, different answers each time
**Risk**: Unclear requirements, changing minds
**Action**: Document answers, get explicit confirmation

### Reluctance to Write Things Down
**Signal**: "Let's not get too formal"
**Risk**: No accountability, selective memory
**Action**: Summarize conversations in writing, get acknowledgment

### Absent Key Stakeholders
**Signal**: Decision-makers never in meetings
**Risk**: Decisions get overturned, rework
**Action**: Require decision-maker presence or delegation

### Over-Promising
**Signal**: "This will solve all our problems"
**Risk**: Unrealistic expectations, disappointment
**Action**: Set realistic expectations, define clear success criteria

---

## User/Market Red Flags

### Building for Imaginary Users
**Signal**: No actual user research, just assumptions
**Risk**: Building something nobody wants
**Action**: Talk to real users before finalizing requirements

### Feature-Driven Instead of Problem-Driven
**Signal**: "We need feature X" without explaining why
**Risk**: Solutions without problems
**Action**: Always ask "What problem does this solve?"

### Copying Competitors
**Signal**: "We need what [competitor] has"
**Risk**: Me-too product with no differentiation
**Action**: Understand why competitors built features, assess fit

### Solution Looking for a Problem
**Signal**: Technology-first thinking
**Risk**: Impressive tech that nobody uses
**Action**: Start with user problems, then choose technology

---

## When to Pause Discovery

Stop and reassess if you see 3+ red flags:

1. **Route Change Needed**: Signals suggest wrong discovery route
2. **Stakeholder Work Needed**: Alignment issues before requirements
3. **Research Needed**: Too many assumptions, not enough facts
4. **Timeline Needed**: Discovery can't complete without more time
5. **Kill the Project**: Fundamental issues that can't be resolved

Better to pause early than build the wrong thing.
