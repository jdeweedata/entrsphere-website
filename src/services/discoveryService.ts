// Discovery Service
// Handles saving sessions to Convex and future Agent SDK integration

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { DiscoverySession, DiscoveryRoute } from "@/types/discovery";

// Initialize Convex client
const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// Type for session data to save
interface SessionData {
  sessionId: string;
  route: Exclude<DiscoveryRoute, null>;
  answers: Record<string, string>;
  signals: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  email?: string;
  wantsUpdates?: boolean;
  durationSeconds?: number;
}

/**
 * Save a discovery session to Convex
 * This is the core MOAT data accumulation function
 */
export async function saveDiscoverySession(
  session: DiscoverySession,
  email?: string,
  wantsUpdates?: boolean
): Promise<{ success: boolean; message: string }> {
  if (!convex) {
    console.warn("Convex not configured, session not saved to backend");
    return { success: true, message: "Session saved locally only" };
  }

  if (!session.detectedRoute) {
    return { success: false, message: "No route detected" };
  }

  const durationSeconds = session.completedAt
    ? Math.round(
        (session.completedAt.getTime() - session.startedAt.getTime()) / 1000
      )
    : undefined;

  const sessionData: SessionData = {
    sessionId: session.id,
    route: session.detectedRoute,
    answers: {
      q1_opener: session.answers.q1_opener,
      q2_clarity: session.answers.q2_clarity,
      q3_systems: session.answers.q3_systems,
      q4_authority: session.answers.q4_authority,
      q5_constraints: session.answers.q5_constraints,
    },
    signals: session.signals,
    email,
    wantsUpdates,
    durationSeconds,
  };

  try {
    const result = await convex.mutation(api.discovery.saveSession, sessionData);
    return result;
  } catch (error) {
    console.error("Failed to save discovery session:", error);
    return { success: false, message: "Failed to save session" };
  }
}

/**
 * Get discovery stats for displaying on the page
 */
export async function getDiscoveryStats(): Promise<{
  total: number;
  byRoute: Record<string, number>;
  avgDurationSeconds: number;
} | null> {
  if (!convex) {
    return null;
  }

  try {
    const stats = await convex.query(api.discovery.getRouteStats);
    return stats;
  } catch (error) {
    console.error("Failed to get discovery stats:", error);
    return null;
  }
}

/**
 * Get pattern insights for Discovery Intelligence feature
 */
export async function getPatternInsights(): Promise<{
  hasEnoughData: boolean;
  sessionCount: number;
  insights: string[];
  routeDistribution?: Record<string, number>;
} | null> {
  if (!convex) {
    return null;
  }

  try {
    const insights = await convex.query(api.discovery.getPatternInsights);
    return insights;
  } catch (error) {
    console.error("Failed to get pattern insights:", error);
    return null;
  }
}

// ============================================
// AGENT SDK INTEGRATION STUB
// ============================================
// The code below is a placeholder for full Agent SDK integration.
// When ready to implement:
// 1. Install: npm install @anthropic-ai/claude-agent-sdk
// 2. Set up a backend API route (Vercel/Netlify function or separate server)
// 3. Replace these stubs with actual Agent SDK calls

/**
 * STUB: Start a full discovery session with Agent SDK
 * This will be a server-side function that streams agent responses
 *
 * Future implementation:
 * ```typescript
 * import { query, ClaudeAgentOptions } from "@anthropic-ai/claude-agent-sdk";
 *
 * export async function* startAgentSession(userMessage: string) {
 *   for await (const message of query({
 *     prompt: `${DISCOVERY_ROUTER_PROMPT}\n\nUser: ${userMessage}`,
 *     options: {
 *       allowedTools: ["AskUserQuestion", "Write", "Task"],
 *       agents: DISCOVERY_AGENTS,
 *       hooks: { PostToolUse: [{ matcher: "Write", hooks: [captureSpec] }] }
 *     }
 *   })) {
 *     yield message;
 *   }
 * }
 * ```
 */
export async function startFullDiscoverySession(
  _initialMessage: string
): Promise<{ supported: false; message: string }> {
  // This is a stub - full Agent SDK sessions require a backend
  return {
    supported: false,
    message:
      "Full discovery sessions require the Agent SDK backend. " +
      "The free demo uses client-side routing. " +
      "Get the Discovery Router Toolkit for production-ready SPEC.json generation.",
  };
}

/**
 * STUB: Resume an existing Agent SDK session
 */
export async function resumeAgentSession(
  _sessionId: string
): Promise<{ supported: false; message: string }> {
  return {
    supported: false,
    message: "Agent SDK session resumption not yet implemented.",
  };
}

/**
 * STUB: Generate SPEC.json from a full session
 * This would be the output of a complete Route A/B/C/D discovery
 */
export interface SpecJson {
  project: {
    name: string;
    summary: string;
    route: DiscoveryRoute;
    status: "discovery-complete" | "ready-for-development";
  };
  users: Array<{
    type: string;
    persona: string;
    context: string;
  }>;
  features: Array<{
    id: string;
    priority: "must-have" | "nice-to-have";
    user_story: string;
    acceptance_criteria: string[];
    passes: boolean;
  }>;
  constraints: {
    business_rules: string[];
    permissions: string[];
  };
  open_questions: string[];
}

export async function generateSpecJson(
  _session: DiscoverySession
): Promise<{ supported: false; message: string }> {
  return {
    supported: false,
    message:
      "SPEC.json generation requires a full discovery session with Agent SDK. " +
      "Available in the Discovery Router Toolkit.",
  };
}

// ============================================
// FUTURE: EMAIL SERVICE INTEGRATION
// ============================================

/**
 * Send discovery profile to user's email
 * Integrate with Resend, SendGrid, or similar
 */
export async function sendDiscoveryProfile(
  email: string,
  session: DiscoverySession
): Promise<{ success: boolean; message: string }> {
  // TODO: Implement email sending with Resend or similar
  // For now, just save the session
  const saveResult = await saveDiscoverySession(session, email, true);

  if (!saveResult.success) {
    return saveResult;
  }

  // In production, this would send an actual email
  console.log(`[EMAIL STUB] Would send discovery profile to ${email}`);
  console.log(`[EMAIL STUB] Route: ${session.detectedRoute}`);
  console.log(`[EMAIL STUB] Answers:`, session.answers);

  return {
    success: true,
    message: "Profile saved. Email sending not yet configured.",
  };
}
