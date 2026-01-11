---
title: Empty message content error in Anthropic API agentic loop
date: 2026-01-11
category: integration-issues
tags:
  - anthropic-api
  - discovery-agent
  - chat-flow
  - tool-use
  - validation
  - agentic-loop
severity: high
component: src/app/api/discovery/agent/route.ts
symptoms:
  - API 400 error "messages.1: all messages must have non-empty content"
  - Chat flow breaking after tool use iterations
  - Empty assistant messages in conversation history
  - Claude responses containing only tool_use blocks with no text
related_commits:
  - 31e7c0e (Fix empty message content error in discovery chat flow)
---

# Empty Message Content Error in Anthropic API Agentic Loop

## Problem Summary

When using the Anthropic API with tool use in agentic loops, Claude may return responses containing **only `tool_use` blocks** with no accompanying text content. When this assistant message is included in subsequent API calls, it fails with:

```
400 {"type":"error","error":{"type":"invalid_request_error","message":"messages.1: all messages must have non-empty content except for the optional final assistant message"}}
```

## Root Cause Analysis

### The Agentic Loop Problem

The Discovery Router uses an agentic loop where Claude can make multiple tool calls before providing a final response:

1. User sends a message
2. Claude may call tools (e.g., `list_directory`, `read_file`) without text
3. Tool results are returned to Claude
4. Claude continues until done, then provides a text response

**The Bug**: When Claude's response contained ONLY tool calls (no text block), the extracted `finalText` would be an empty string `""`. This empty content caused errors when the conversation history was sent back to the API.

### Three Failure Points Identified

1. **API Route**: Could return empty `content` field if Claude only made tool calls
2. **Service Layer**: Could send messages with empty content strings to the API
3. **System Prompt**: Did not explicitly instruct Claude to always provide text responses

## Solution: Three-Layer Defense

### 1. API Route Fix

**File**: `src/app/api/discovery/agent/route.ts`

#### A. Increased maxIterations for reliable tool use

```typescript
// BEFORE
const maxIterations = 3;

// AFTER
const maxIterations = 5; // Allow enough iterations for tool calls + final text response
```

#### B. Added fallback response for empty content

```typescript
// Extract final text response
const textContent = response?.content.find((c) => c.type === "text");
let finalText = textContent?.type === "text" ? textContent.text : "";

// Ensure we never return empty content (causes API errors on subsequent calls)
if (!finalText || !finalText.trim()) {
  finalText = "I'm processing your request. Please continue with your next question or provide more details.";
}

return NextResponse.json({
  content: finalText,  // Always has valid content
  // ...
});
```

### 2. Service Layer Fix

**File**: `src/services/discoveryService.ts`

Added message filtering before sending to API:

```typescript
export async function sendFilesystemAgentMessage(
  messages: ChatMessage[],
  sessionId: string,
  route: DiscoveryRoute,
  signals: { A: number; B: number; C: number; D: number }
): Promise<FilesystemAgentResponse> {
  // Filter out any messages with empty content (causes API errors)
  const validMessages = messages.filter(
    (m) => m.content && m.content.trim().length > 0
  );

  if (validMessages.length === 0) {
    throw new Error("No valid messages to send");
  }

  const response = await fetch(`${API_BASE}/api/discovery/agent`, {
    // ...
    body: JSON.stringify({
      messages: validMessages,  // Only valid messages
      // ...
    }),
  });
}
```

### 3. System Prompt Fix

**File**: `src/app/api/discovery/_lib/prompts.ts`

Added critical response requirement to the filesystem agent prompt:

```typescript
## Critical Response Requirement

**ALWAYS include a text response to the user after using tools.** Never end your turn with only tool calls - the user must receive a helpful message. After reading playbooks or knowledge files, synthesize the information and respond conversationally to guide the discovery session.

When starting a new session:
1. First, use tools to load relevant playbook and context
2. THEN immediately respond with a warm welcome and your first discovery question
3. Never leave the user waiting without a response
```

## Summary of Changes

| File | Change |
|------|--------|
| `src/app/api/discovery/agent/route.ts` | Increased `maxIterations` from 3 to 5; Added fallback response for empty content |
| `src/services/discoveryService.ts` | Added message filtering to remove empty content |
| `src/app/api/discovery/_lib/prompts.ts` | Added "Critical Response Requirement" section |

## Defense-in-Depth Strategy

This solution implements three layers of protection:

1. **Prompt-level** (Preventive): Tell Claude to always include text responses
2. **Service-level** (Filtering): Remove any empty messages before sending to API
3. **API-level** (Fallback): Ensure the response always has content, even if Claude doesn't provide it

## Prevention Strategies

### Best Practices for Agentic Loops

1. **Always validate messages** before API calls
2. **Normalize assistant messages** that contain only tool_use blocks
3. **Check for text content** before returning from the loop
4. **Set appropriate max iterations** to prevent infinite loops
5. **Implement fallback responses** for edge cases
6. **Log empty content events** for monitoring

### Message Validation Pattern

```typescript
function validateMessages(messages: Array<{ role: string; content: string }>): string | null {
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === "assistant" && !msg.content?.trim()) {
      return `Message ${i}: Assistant message has empty content`;
    }
  }
  return null;
}
```

### Monitoring Recommendations

Track these metrics:
- `agent.empty_content_rate` - % of responses with no text content (alert > 5%)
- `agent.max_iterations_hit` - Sessions hitting max iteration limit (alert > 2%)
- `agent.fallback_response_rate` - Sessions returning fallback text (alert > 3%)

## Testing

To verify the fix works:

1. Start a new Discovery Router session
2. Send an initial message (Claude will use tools to load playbooks)
3. Continue the conversation with follow-up questions
4. Verify no 400 errors occur in the console
5. Verify assistant messages always have content

## Related Documentation

- `src/app/api/discovery/_lib/prompts.ts` - System prompts for Discovery Router
- `src/app/api/discovery/_lib/model-selector.ts` - Model selection logic
- `docs/discovery-prompts/DISCOVERY_ROUTER_PROMPT.md` - Complete discovery framework
- `discovery-fs/playbooks/` - Route-specific playbooks

## Cross-References

- Commit: `31e7c0e` - Fix empty message content error in discovery chat flow
- Commit: `c83e0a0` - Add Discovery Router Toolkit session page and payment integration
