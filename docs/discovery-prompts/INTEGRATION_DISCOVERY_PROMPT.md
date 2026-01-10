# Integration Discovery Prompt

> **For Claude Code — Integration-Heavy Projects**  
> Use when success depends on understanding existing systems. Pairs business discovery with technical discovery.

---

## 🎯 When to Use This Prompt

Use this when you hear:

| Signal | What It Means |
|--------|---------------|
| "It needs to work with our existing [system]" | Integration dependency |
| "We already have a database for that" | Existing data architecture |
| "Talk to [dev name] about how that works" | Technical knowledge lives elsewhere |
| "I don't know how it's built, but..." | Business/technical knowledge split |
| "The old system does X, we need the new thing to connect" | Legacy integration |
| "It has to pull data from [source]" | API/data dependencies |
| "We can't break what's already working" | Constraint from existing systems |

**This prompt is for:**
- Projects touching existing databases, APIs, or services
- Migrations or modernizations of legacy systems
- Features that must integrate with multiple existing tools
- Situations where business stakeholders don't know technical architecture

**This prompt produces:**
- Business requirements (from non-technical stakeholder)
- Technical questions (for developer/architect session)
- Integration map (systems, data flows, dependencies)
- Merged specification (business + technical combined)

---

## 🔀 Dual-Track Approach

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRACK A: Business Discovery                  │
│                    (Non-Technical Stakeholder)                  │
│                                                                 │
│  "What do you need? Why? Who uses it? What's success?"         │
│                                                                 │
│  Output: Business requirements, user stories, success criteria  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 INTEGRATION QUESTIONS IDENTIFIED                │
│                                                                 │
│  "This needs technical input: [list of questions]"             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TRACK B: Technical Discovery                  │
│                   (Developer / Architect)                       │
│                                                                 │
│  "How does [system] work? What APIs exist? What are limits?"   │
│                                                                 │
│  Output: Integration map, technical constraints, architecture   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MERGED SPECIFICATION                       │
│                                                                 │
│  Business requirements + Technical architecture = Complete spec │
└─────────────────────────────────────────────────────────────────┘
```

---

# TRACK A: Business Discovery

## 🎯 Warm-Up for Non-Technical Stakeholder

**Welcome!** I'll ask you about what you need from a business perspective. When we hit technical details about how existing systems work, I'll note those as questions for your technical team—you don't need to know those answers.

### What I'll ask you about:
- What problem we're solving and why it matters
- Who will use this and how
- What systems this needs to connect to (names are enough—I won't ask how they work)
- What success looks like from a user perspective

### What I WON'T ask you:
- How databases are structured
- What APIs exist or how they work
- Technical implementation details
- Architecture decisions

**Let's start with what you know best—the business need.**

---

## Business Interview Questions

### Category 1: The Business Need

```
"What's the core problem we're solving?"

"Why is this important now? What's the cost of not doing this?"

"Who will use this? Describe them and their typical day."

"What does success look like? How will you know it's working?"
```

---

### Category 2: System Touchpoints (Names, Not Details)

**Goal:** Identify WHAT systems are involved, not HOW they work.

```
"What existing systems or tools does this need to connect to?"
(Just names are fine—e.g., "Salesforce," "our customer database," "the billing system")

"Where does the data currently live that this feature needs?"

"Are there other tools users currently switch between to do this task?"

"What systems would need to be updated when this feature does its job?"
```

**For each system mentioned, note:**
```markdown
## System Touchpoint: [System Name]

**Mentioned by:** [Stakeholder]
**Business context:** [Why this system is involved]
**Data needed FROM this system:** [What information is needed]
**Data sent TO this system:** [What updates are needed]
**Technical questions (for Track B):**
- How do we connect to [system]?
- What API/interface exists?
- What are the rate limits or constraints?
- Who owns this system?
```

---

### Category 3: Business Rules & Constraints

```
"Are there business rules about how this data should flow?"
(e.g., "Customer records can only be updated by support staff")

"Are there timing requirements?"
(e.g., "Data needs to sync within 5 minutes")

"Are there compliance or security requirements?"
(e.g., "PII can't be stored in [location]")

"What permissions or access levels matter?"
```

---

### Category 4: Current Workarounds

**Gold mine for integration requirements—how do they do it today?**

```
"Walk me through how someone does this task today, step by step."

"Which systems do they touch along the way?"

"Where do they copy/paste data between systems?"

"What's the most frustrating part of the current process?"

"Are there any manual steps that should become automatic?"
```

---

### Category 5: Success From User's View

```
"Describe the ideal experience—what does the user see and do?"

"How much faster/easier should this be compared to today?"

"What should happen automatically that's manual today?"

"If this works perfectly, what changes for the business?"
```

---

## Flagging Technical Questions

Throughout the business interview, flag questions that need technical input:

```markdown
## 🔧 Technical Questions (For Track B)

### Integration Questions
- [ ] How do we authenticate with [System A]?
- [ ] What API endpoints exist for [System B]?
- [ ] What's the data schema for [Entity] in [Database]?
- [ ] Are there rate limits on [Service]?

### Architecture Questions
- [ ] Where should this new service live?
- [ ] What's the deployment model for [existing system]?
- [ ] Are there existing patterns for [type of integration]?

### Constraint Questions
- [ ] What's the SLA for [System]?
- [ ] What happens if [System] is down?
- [ ] Are there data residency requirements?

### Ownership Questions
- [ ] Who maintains [System A]?
- [ ] What team owns the [Database] schema?
- [ ] Who approves changes to [Integration Point]?
```

---

## Track A Output: BUSINESS_REQUIREMENTS.md

```markdown
# Business Requirements: [Project Name]

**Source:** Non-technical stakeholder interview  
**Date:** [Date]  
**Status:** Pending technical discovery

---

## Problem Statement
[What problem, who has it, why it matters]

## Users
[Who will use this, their context]

## System Touchpoints (Business View)

| System | Why Involved | Data Needed | Data Sent |
|--------|--------------|-------------|-----------|
| [Name] | [Business reason] | [What we need from it] | [What we send to it] |
| [Name] | [Business reason] | [What we need from it] | [What we send to it] |

## User Stories

### US-1: [Story]
As a [user], I want to [action] so that [benefit].

**Current process:** [How they do it today]  
**Desired process:** [How it should work]  
**Systems involved:** [List from touchpoints]

### US-2: [Story]
[Same format]

## Business Rules
- [Rule about data flow]
- [Permission requirement]
- [Timing requirement]

## Success Criteria (Business)
- [ ] [User-facing outcome]
- [ ] [Efficiency improvement]
- [ ] [Business metric]

## 🔧 Technical Questions (For Track B)
[List all flagged questions]

---

**Next Step:** Technical discovery session to answer flagged questions
```

---

# TRACK B: Technical Discovery

## 🎯 Context for Developer/Architect

**Background:** We've completed business discovery with [stakeholder]. We understand WHAT they need and WHY. Now we need to understand HOW—the technical landscape this will integrate with.

### What we already know (from business interview):
- [Summary of business requirements]
- [Systems mentioned by stakeholder]
- [Data flows described at business level]

### What we need from you:
- How these systems actually work
- What integration options exist
- Technical constraints and limitations
- Architecture recommendations

---

## Technical Interview Questions

### Category 1: System Architecture

For each system mentioned in Track A:

```
"Tell me about [System A]. What is it, and how is it architected?"

"How do other services currently integrate with [System A]?"

"Is there an API? REST, GraphQL, events, database connection?"

"What authentication/authorization does [System A] require?"

"Who owns [System A]? What's the process for requesting changes?"
```

**Document for each system:**
```markdown
## System: [Name]

### Overview
- **Type:** [Database / API / SaaS / Internal Service / Legacy]
- **Owner:** [Team/Person]
- **Documentation:** [Link if available]

### Integration Options
| Method | Available? | Notes |
|--------|------------|-------|
| REST API | Yes/No | [Details] |
| GraphQL | Yes/No | [Details] |
| Database Direct | Yes/No | [Details] |
| Event/Message Bus | Yes/No | [Details] |
| File Export/Import | Yes/No | [Details] |

### Authentication
- **Method:** [OAuth, API Key, Service Account, etc.]
- **How to obtain:** [Process]
- **Limitations:** [Expiry, rotation, etc.]

### Constraints
- **Rate limits:** [X calls per minute/hour]
- **Data limits:** [Max records per request]
- **SLA:** [Uptime guarantee]
- **Downtime windows:** [Maintenance schedules]
```

---

### Category 2: Data Model

```
"What does the data model look like for [Entity] in [System]?"

"What fields are available? What are required vs. optional?"

"Are there relationships between [Entity A] and [Entity B]?"

"What's the source of truth for [data element]?"

"Are there data quality issues we should know about?"
```

**Document:**
```markdown
## Data Model: [Entity]

**Source system:** [System name]  
**Source of truth:** Yes/No

### Fields
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | Yes | Primary key |
| [field] | [type] | [Yes/No] | [Notes] |

### Relationships
- [Entity] has many [Related Entity]
- [Entity] belongs to [Parent Entity]

### Data Quality Notes
- [Known issues]
- [Cleanup needed]
```

---

### Category 3: Existing Patterns

```
"Are there existing integrations we should model after?"

"Is there a standard pattern for [type of integration] here?"

"Are there shared libraries or SDKs we should use?"

"What's the preferred approach for [sync vs. async, batch vs. real-time]?"

"Are there any anti-patterns or approaches that failed before?"
```

---

### Category 4: Constraints & Risks

```
"What could break if we do this wrong?"

"Are there performance concerns with [System]?"

"What happens if [System A] is down? How should we handle it?"

"Are there data consistency challenges we should know about?"

"What's the rollback plan if this integration fails?"
```

**Document:**
```markdown
## Integration Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [System A] downtime | [H/M/L] | [Description] | [Approach] |
| Data sync lag | [H/M/L] | [Description] | [Approach] |
| Rate limiting | [H/M/L] | [Description] | [Approach] |
```

---

### Category 5: Technical Recommendations

```
"Based on what you know, what's your recommended approach?"

"Should this be sync or async? Why?"

"Where should this new service/feature live architecturally?"

"What would you estimate for integration complexity? [Low/Med/High]"

"Are there dependencies that could block this work?"
```

---

## Track B Output: TECHNICAL_DISCOVERY.md

```markdown
# Technical Discovery: [Project Name]

**Source:** Developer/Architect interview  
**Date:** [Date]  
**Interviewee:** [Name/Role]

---

## Architecture Overview

[Diagram or description of how systems connect]

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   System A   │────►│   New        │────►│   System B   │
│   (Source)   │     │   Feature    │     │   (Target)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
  [Auth method]      [Where it lives]     [Auth method]
```

## System Details

### System A: [Name]
[Details from interview]

### System B: [Name]
[Details from interview]

## Data Flows

| Flow | Source | Target | Method | Frequency | Volume |
|------|--------|--------|--------|-----------|--------|
| [Name] | [Sys] | [Sys] | [API/Event/etc] | [Real-time/Batch] | [Est records] |

## Technical Constraints
- [Constraint 1]
- [Constraint 2]

## Recommended Approach
[Developer's recommendation with rationale]

## Risks & Mitigations
[Table of risks]

## Dependencies
- [ ] [Dependency 1] - Owner: [Name] - Status: [Status]
- [ ] [Dependency 2] - Owner: [Name] - Status: [Status]

## Open Technical Questions
- [ ] [Question still unanswered]

---

**Next Step:** Merge with business requirements into final spec
```

---

# MERGE: Combined Specification

## Merging Business + Technical

After both tracks complete, merge into unified spec:

```markdown
# Integration Specification: [Project Name]

**Business Discovery:** [Date] with [Stakeholder]  
**Technical Discovery:** [Date] with [Developer]  
**Status:** Ready for development

---

## Executive Summary

**Business Need:** [From Track A]  
**Technical Approach:** [From Track B]  
**Integration Complexity:** [Low/Medium/High]

---

## User Stories (Business + Technical)

### US-1: [Business Story]

**As a** [user]  
**I want to** [action]  
**So that** [benefit]

**Business Acceptance Criteria:**
- [ ] [User-facing criteria from Track A]
- [ ] [User-facing criteria from Track A]

**Technical Implementation:**
- **Source system:** [System A via REST API]
- **Target system:** [System B via event bus]
- **Data mapping:**
  | Source Field | Target Field | Transform |
  |--------------|--------------|-----------|
  | [field] | [field] | [None/Logic] |

**Technical Acceptance Criteria:**
- [ ] Successfully authenticates with [System A]
- [ ] Handles [System A] downtime gracefully
- [ ] Respects rate limits ([X] calls/minute)
- [ ] Data syncs within [X] minutes

---

## Integration Architecture

```
[ASCII diagram from Track B, annotated with business context]
```

## System Reference

| System | Role | Integration Method | Owner | SLA |
|--------|------|-------------------|-------|-----|
| [Name] | Source of [data] | REST API | [Team] | [%] |
| [Name] | Target for [action] | Events | [Team] | [%] |

## Data Flows

[Detailed data flow documentation]

## Error Handling

| Scenario | Business Impact | Technical Response |
|----------|-----------------|-------------------|
| [System A] down | [User can't do X] | [Retry with backoff, show message] |
| Invalid data | [Record rejected] | [Queue for review, notify user] |

## Non-Functional Requirements

| Requirement | Business Need | Technical Target |
|-------------|---------------|------------------|
| Performance | "Should be fast" | < 2 second response |
| Availability | "Can't go down during business hours" | 99.9% uptime 8am-6pm |
| Data freshness | "Need current data" | Sync within 5 minutes |

## Dependencies & Risks

[Combined from both tracks]

## Out of Scope

- [From business: Feature X deferred]
- [From technical: Integration Y not feasible now]

## Open Questions

- [ ] [Business question still open]
- [ ] [Technical question still open]
```

---

## Final Output: SPEC.json

```json
{
  "project": {
    "name": "Project Name",
    "type": "integration",
    "status": "ready-for-development",
    "created": "YYYY-MM-DD",
    "business_stakeholder": "Name",
    "technical_contact": "Name"
  },
  "systems": [
    {
      "name": "System A",
      "role": "source",
      "integration_method": "REST API",
      "owner": "Team Name",
      "auth": "OAuth 2.0",
      "rate_limit": "100/minute",
      "sla": "99.9%",
      "documentation": "https://..."
    },
    {
      "name": "System B",
      "role": "target",
      "integration_method": "Event Bus",
      "owner": "Team Name",
      "auth": "Service Account",
      "rate_limit": null,
      "sla": "99.5%",
      "documentation": "https://..."
    }
  ],
  "data_flows": [
    {
      "name": "Customer Sync",
      "source": "System A",
      "target": "System B",
      "trigger": "On customer update",
      "frequency": "Real-time",
      "volume_estimate": "~1000/day",
      "mapping": [
        {"source": "customer_id", "target": "external_id", "transform": null},
        {"source": "full_name", "target": "name", "transform": null}
      ]
    }
  ],
  "features": [
    {
      "id": "INT-1",
      "priority": "must-have",
      "user_story": "As a [user], I want [feature] so that [benefit]",
      "business_criteria": [
        "User can see [data] from [System A]",
        "Changes reflect in [System B] within 5 minutes"
      ],
      "technical_criteria": [
        "Authenticates with System A using OAuth",
        "Handles 429 rate limit responses with exponential backoff",
        "Publishes events to System B topic",
        "Logs all integration failures for debugging"
      ],
      "error_handling": [
        {"scenario": "System A unavailable", "response": "Show cached data, retry in background"},
        {"scenario": "Invalid data from source", "response": "Log error, skip record, alert on threshold"}
      ],
      "passes": false,
      "technical_notes": "See TECHNICAL_DISCOVERY.md for API details"
    }
  ],
  "non_functional": {
    "performance": "< 2 second response for user-facing queries",
    "availability": "99.9% during business hours",
    "data_freshness": "Within 5 minutes of source change",
    "error_rate": "< 0.1% of integration calls"
  },
  "risks": [
    {
      "risk": "System A rate limiting",
      "likelihood": "medium",
      "impact": "Delayed data sync",
      "mitigation": "Implement request queuing and backoff"
    }
  ],
  "dependencies": [
    {
      "dependency": "API access to System A",
      "owner": "Platform Team",
      "status": "pending",
      "blocker": true
    }
  ]
}
```

---

## How to Use in Claude Code

### Option 1: Full Dual-Track Process

```bash
# Start with business discovery
claude
> Read @INTEGRATION_DISCOVERY_PROMPT.md
> I'm [stakeholder name], a non-technical stakeholder.
> Interview me about the business requirements (Track A).

# After Track A completes, switch to technical discovery
> Now I'm [developer name], the technical contact.
> Here's the business requirements: @BUSINESS_REQUIREMENTS.md
> Interview me about the technical architecture (Track B).

# Finally, merge both tracks
> Merge @BUSINESS_REQUIREMENTS.md and @TECHNICAL_DISCOVERY.md
> Generate the final SPEC.json for development.
```

### Option 2: Sequential Sessions

```bash
# Session 1: Business stakeholder
claude
> Read @INTEGRATION_DISCOVERY_PROMPT.md - Track A only
> Interview me for business requirements.
# Output: BUSINESS_REQUIREMENTS.md with technical questions flagged

# Session 2: Developer (separate meeting)
claude  
> Read @INTEGRATION_DISCOVERY_PROMPT.md - Track B only
> Here are the technical questions from business discovery: @BUSINESS_REQUIREMENTS.md
> Interview me about the technical architecture.
# Output: TECHNICAL_DISCOVERY.md

# Session 3: Merge
claude
> Merge @BUSINESS_REQUIREMENTS.md and @TECHNICAL_DISCOVERY.md
> Generate unified SPEC.json
```

---

## Quick Reference: Who Answers What

| Question Type | Ask Business Stakeholder | Ask Developer/Architect |
|--------------|-------------------------|------------------------|
| What problem are we solving? | ✅ | ❌ |
| Who uses this? | ✅ | ❌ |
| What systems are involved? (names) | ✅ | ✅ |
| How do those systems work? | ❌ | ✅ |
| What's the API look like? | ❌ | ✅ |
| What does success look like? | ✅ | ❌ |
| What are the performance needs? | ✅ (business terms) | ✅ (technical targets) |
| What could go wrong? | ✅ (user impact) | ✅ (technical failures) |
| How do we handle errors? | ❌ | ✅ |
| What's the data model? | ❌ | ✅ |

---

## Prompt Selection Guide

| Situation | Prompt |
|-----------|--------|
| Stakeholder knows requirements, no integrations | Discovery Prompt |
| "I'll know it when I see it" | Exploratory Prompt |
| Political/strategic ambiguity | Ambiguity Prompt |
| Touches existing systems, need technical detail | **Integration Prompt** |

---

*Generated by Claude Code Integration Discovery Prompt v1.0*
