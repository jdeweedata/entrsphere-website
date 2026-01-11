// Discovery Service
// Handles saving sessions to Convex and future Agent SDK integration

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { DiscoverySession, DiscoveryRoute } from "@/types/discovery";

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
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
  insights?: string[];
  routeDistribution?: Record<string, number>;
  message?: string;
} | null> {
  if (!convex) {
    return null;
  }

  try {
    const result = await convex.query(api.discovery.getPatternInsights);
    return {
      hasEnoughData: result.hasEnoughData,
      sessionCount: result.sessionCount,
      insights: result.insights,
      routeDistribution: result.routeDistribution,
      message: result.message,
    };
  } catch (error) {
    console.error("Failed to get pattern insights:", error);
    return null;
  }
}

// ============================================
// AGENT SDK INTEGRATION
// ============================================
// Uses Anthropic's Claude API via Vercel serverless functions
// Tiered model selection: Haiku 4.5 for standard, Opus 4.5 for complex

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StreamEvent {
  type: "text" | "done";
  text?: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    model: string;
    cache_read_input_tokens?: number;
  };
  model?: string;
}

/**
 * Start a full discovery session with Claude API
 * Uses streaming for real-time responses
 */
export async function* streamDiscoveryChat(
  messages: ChatMessage[],
  sessionId: string,
  signals: { A: number; B: number; C: number; D: number },
  detectedRoute: DiscoveryRoute
): AsyncGenerator<StreamEvent> {
  const response = await fetch(`${API_BASE}/api/discovery/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      sessionId,
      signals,
      detectedRoute,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to connect to discovery API");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const event: StreamEvent = JSON.parse(line.slice(6));
          yield event;
        } catch {
          // Skip invalid JSON lines
        }
      }
    }
  }
}

/**
 * Non-streaming discovery chat (for simpler use cases)
 */
export async function sendDiscoveryMessage(
  messages: ChatMessage[],
  sessionId: string,
  signals: { A: number; B: number; C: number; D: number },
  detectedRoute: DiscoveryRoute
): Promise<{
  content: string;
  usage: { input_tokens: number; output_tokens: number; model: string };
}> {
  const response = await fetch(`${API_BASE}/api/discovery/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      sessionId,
      signals,
      detectedRoute,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to connect to discovery API");
  }

  return response.json();
}

/**
 * Check if Agent SDK backend is available
 */
export async function checkAgentAvailability(): Promise<{
  available: boolean;
  message: string;
}> {
  try {
    const response = await fetch(`${API_BASE}/api/discovery/chat`, {
      method: "OPTIONS",
    });
    return {
      available: response.ok,
      message: response.ok
        ? "Agent SDK backend is available"
        : "Agent SDK backend not configured",
    };
  } catch {
    return {
      available: false,
      message: "Agent SDK backend not reachable. Using client-side routing.",
    };
  }
}

/**
 * SPEC.json structure for generated specifications
 */
export interface SpecJson {
  project: {
    name: string;
    summary: string;
    route: DiscoveryRoute;
    status: "discovery-complete" | "ready-for-development";
    generated_at?: string;
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
    technical_notes?: string;
  }>;
  constraints: {
    business_rules: string[];
    technical?: string[];
    timeline?: string;
    budget?: string;
  };
  integrations?: Array<{
    system: string;
    type: "API" | "database" | "file" | "manual";
    complexity: "low" | "medium" | "high";
    notes?: string;
  }>;
  open_questions: string[];
  risks?: Array<{
    description: string;
    severity: "low" | "medium" | "high";
    mitigation: string;
  }>;
  meta?: {
    generated_at: string;
    session_id: string;
    route: string;
    model: string;
    tokens_used: number;
  };
}

/**
 * Generate SPEC.json from a completed discovery session
 * Uses Opus 4.5 for complex synthesis
 */
export async function generateSpecJson(
  session: DiscoverySession,
  messages: ChatMessage[],
  projectContext?: { name?: string; description?: string }
): Promise<{
  success: boolean;
  spec?: SpecJson;
  error?: string;
  usage?: { input_tokens: number; output_tokens: number; model: string };
}> {
  if (!session.detectedRoute) {
    return {
      success: false,
      error: "No route detected. Complete the discovery session first.",
    };
  }

  try {
    const response = await fetch(`${API_BASE}/api/discovery/generate-spec`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        sessionId: session.id,
        route: session.detectedRoute,
        projectContext,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Failed to generate SPEC.json",
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================
// SPEC PREVIEW (Freemium Flow)
// ============================================

export interface SpecPreview {
  preview: true;
  project: {
    name: string;
    summary: string;
    route: string;
    status: "preview";
  };
  features_preview: Array<{
    id: string;
    title: string;
    priority: "must-have" | "nice-to-have";
  }>;
  locked_content: {
    full_features_count: number;
    has_integrations: boolean;
    has_constraints: boolean;
    has_risks: boolean;
    has_acceptance_criteria: boolean;
  };
  upgrade_cta: string;
  meta?: {
    generated_at: string;
    session_id: string;
    route: string;
    email_captured: string;
    model: string;
  };
}

/**
 * Generate a SPEC preview (freemium - requires email)
 * Returns limited spec to entice upgrade
 */
export async function generateSpecPreview(
  messages: ChatMessage[],
  sessionId: string,
  route: DiscoveryRoute,
  email: string
): Promise<{
  success: boolean;
  preview?: SpecPreview;
  error?: string;
  usage?: { input_tokens: number; output_tokens: number; model: string };
}> {
  if (!route) {
    return {
      success: false,
      error: "No route detected. Continue the discovery conversation.",
    };
  }

  try {
    const response = await fetch(`${API_BASE}/api/discovery/generate-spec-preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        sessionId,
        route,
        email,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Failed to generate preview",
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Save SPEC preview lead to Convex
 */
export async function saveSpecPreviewLead(
  email: string,
  sessionId: string,
  route: DiscoveryRoute,
  signals: { A: number; B: number; C: number; D: number },
  conversationLength: number
): Promise<{ success: boolean; message: string; isRepeat?: boolean }> {
  if (!convex) {
    console.warn("Convex not configured");
    return { success: true, message: "Lead saved locally only" };
  }

  if (!route) {
    return { success: false, message: "No route detected" };
  }

  try {
    const result = await convex.mutation(api.discovery.saveSpecPreviewLead, {
      email,
      sessionId,
      route,
      signals,
      conversationLength,
    });
    return result;
  } catch (error) {
    console.error("Failed to save SPEC preview lead:", error);
    return { success: false, message: "Failed to save lead" };
  }
}

// ============================================
// FILESYSTEM AGENT (Vercel Blog Pattern)
// ============================================
// Uses filesystem tools for context management
// Agent explores playbooks, patterns, and session history

interface FilesystemAgentResponse {
  content: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    iterations: number;
    model: string;
  };
}

/**
 * Send a message to the filesystem-powered discovery agent
 * This agent has access to:
 * - /playbooks - Route-specific discovery guides
 * - /templates - SPEC.json schema and question banks
 * - /knowledge - Red flags, scope creep signals
 * - /patterns - Historical route distribution data
 * - /sessions - Past discovery sessions to learn from
 */
export async function sendFilesystemAgentMessage(
  messages: ChatMessage[],
  sessionId: string,
  route: DiscoveryRoute,
  signals: { A: number; B: number; C: number; D: number }
): Promise<FilesystemAgentResponse> {
  const response = await fetch(`${API_BASE}/api/discovery/agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      sessionId,
      route,
      signals,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to connect to filesystem agent");
  }

  return response.json();
}

/**
 * Check if the filesystem agent is available
 */
export async function checkFilesystemAgentAvailability(): Promise<{
  available: boolean;
  message: string;
}> {
  try {
    const response = await fetch(`${API_BASE}/api/discovery/agent`, {
      method: "OPTIONS",
    });
    return {
      available: response.ok,
      message: response.ok
        ? "Filesystem agent is available"
        : "Filesystem agent not configured",
    };
  } catch {
    return {
      available: false,
      message: "Filesystem agent not reachable",
    };
  }
}

// ============================================
// EMAIL SERVICE INTEGRATION (via Resend)
// ============================================

/**
 * Send discovery profile to user's email via Resend
 * This saves the session AND sends a branded email with the results
 */
export async function sendDiscoveryProfile(
  email: string,
  session: DiscoverySession
): Promise<{ success: boolean; message: string }> {
  if (!convex) {
    console.warn("Convex not configured, cannot send email");
    return { success: false, message: "Email service not available" };
  }

  if (!session.detectedRoute) {
    return { success: false, message: "No route detected" };
  }

  // First save the session
  const saveResult = await saveDiscoverySession(session, email, true);

  if (!saveResult.success) {
    return saveResult;
  }

  // Then send the email via Convex action
  try {
    const emailResult = await convex.action(api.discovery.sendDiscoveryEmail, {
      email,
      route: session.detectedRoute,
      answers: {
        q1_opener: session.answers.q1_opener,
        q2_clarity: session.answers.q2_clarity,
        q3_systems: session.answers.q3_systems,
        q4_authority: session.answers.q4_authority,
        q5_constraints: session.answers.q5_constraints,
      },
      signals: session.signals,
      sessionId: session.id,
    });

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      // Still return success since session was saved
      return {
        success: true,
        message: "Profile saved. Email delivery may be delayed.",
      };
    }

    return {
      success: true,
      message: "Profile sent to your email!",
    };
  } catch (error) {
    console.error("Failed to send discovery email:", error);
    // Still return success since session was saved
    return {
      success: true,
      message: "Profile saved. Email delivery may be delayed.",
    };
  }
}
