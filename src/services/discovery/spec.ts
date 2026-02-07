// SPEC generation - full specs and previews

import { DiscoverySession, DiscoveryRoute } from "@/types/discovery";
import { api } from "../../../convex/_generated/api";
import { API_BASE, convex } from "./client";
import { ChatMessage, Signals, SpecJson, SpecPreview, UsageInfo } from "./types";

// Options for generating full SPEC
export interface GenerateSpecOptions {
  session: DiscoverySession;
  messages: ChatMessage[];
  projectContext?: {
    name?: string;
    description?: string;
  };
}

/**
 * Generate SPEC.json from a completed discovery session
 * Uses Opus 4.5 for complex synthesis
 */
export async function generateSpecJson(
  options: GenerateSpecOptions
): Promise<{
  success: boolean;
  spec?: SpecJson;
  error?: string;
  usage?: UsageInfo;
}> {
  const { session, messages, projectContext } = options;

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

// Options for generating SPEC preview
export interface GeneratePreviewOptions {
  messages: ChatMessage[];
  sessionId: string;
  route: DiscoveryRoute;
  email: string;
}

/**
 * Generate a SPEC preview (freemium - requires email)
 * Returns limited spec to entice upgrade
 */
export async function generateSpecPreview(
  options: GeneratePreviewOptions
): Promise<{
  success: boolean;
  preview?: SpecPreview;
  error?: string;
  usage?: UsageInfo;
}> {
  const { messages, sessionId, route, email } = options;

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

// Options for saving SPEC preview lead
export interface SaveLeadOptions {
  email: string;
  sessionId: string;
  route: DiscoveryRoute;
  signals: Signals;
  conversationLength: number;
}

/**
 * Save SPEC preview lead to Convex
 */
export async function saveSpecPreviewLead(
  options: SaveLeadOptions
): Promise<{ success: boolean; message: string; isRepeat?: boolean }> {
  const { email, sessionId, route, signals, conversationLength } = options;

  if (!convex) {
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
  } catch {
    return { success: false, message: "Failed to save lead" };
  }
}
