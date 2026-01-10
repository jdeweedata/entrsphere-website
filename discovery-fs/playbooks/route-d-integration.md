# Route D: Integration Discovery Playbook

## Profile
- **Signal**: "It needs to work with [existing systems]"
- **Duration**: 45-75 minutes (may need technical follow-up)
- **Risk**: Integration complexity is #1 cause of timeline overruns

## What This Means
The user's project lives in an ecosystem. Success depends on how well it plays with existing systems. Your job is to **map the integration landscape** before features.

## Interview Strategy

### Phase 1: System Inventory (15 min)
Catalog everything this touches:
- "List every system this needs to connect to"
- "Which integrations are must-have vs nice-to-have?"
- "What data flows between systems currently?"

Build a system map:
```
| System | Type | Integration | Data Flow | Owner |
|--------|------|-------------|-----------|-------|
| Salesforce | CRM | API | Bi-directional | Sales Ops |
| SAP | ERP | File Export | One-way in | Finance |
| Slack | Comms | Webhook | One-way out | IT |
```

### Phase 2: Data Discovery (15 min)
Understand what flows where:
- "What data needs to move between systems?"
- "What's the source of truth for [key data]?"
- "Are there data quality issues we should know about?"
- "What format is the data in? (API, CSV, manual?)"

### Phase 3: Technical Constraints (15 min)
Surface the hard limits:
- "What access do you have to these systems?"
- "Are there API rate limits or restrictions?"
- "Who maintains these integrations currently?"
- "What happens when an integration fails?"
- "Are there security/compliance requirements?"

### Phase 4: Dependency Mapping (10 min)
Identify critical paths:
- "Which integration is most critical to success?"
- "What's the riskiest integration? Why?"
- "Are there any deprecated systems or planned migrations?"
- "Who do we need to coordinate with?"

### Phase 5: Validation Plan (10 min)
- "How do we test these integrations safely?"
- "Is there a sandbox/staging environment?"
- "What's the rollback plan if something breaks?"

## Red Flags to Watch For
- "I think there's an API" (unverified assumptions)
- Multiple systems as "source of truth" for same data
- No one knows who owns a critical system
- Legacy systems with no documentation
- "We'll figure out the integration later"

## Output: Integration Specification
For Route D, generate an Integration Spec:
- System inventory with owners
- Data flow diagram
- API/Integration requirements per system
- Authentication and security requirements
- Error handling strategy
- Testing approach
- Dependency timeline (what must happen first)

## Technical Checklist
For each integration, capture:
- [ ] API documentation available?
- [ ] Authentication method (OAuth, API key, etc.)
- [ ] Rate limits known?
- [ ] Sandbox environment available?
- [ ] Data format documented?
- [ ] Error responses documented?
- [ ] SLA/uptime requirements?
- [ ] Fallback if system unavailable?

## Common Integration Patterns
1. **Real-time sync** - Webhooks or streaming
2. **Batch sync** - Scheduled jobs, file transfers
3. **On-demand** - API calls triggered by user action
4. **Event-driven** - Message queues, pub/sub

## Warning
Do NOT finalize features until integration feasibility is confirmed. Many "simple" features become complex (or impossible) when integration constraints surface.
