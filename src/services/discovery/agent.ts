// Filesystem Agent - Vercel blog pattern agent with tool access

import { DiscoveryRoute } from "@/types/discovery";
import { API_BASE } from "./client";
import { ChatMessage, FlowStage, FilesystemAgentResponse } from "./types";

// Options for filesystem agent requests
export interface FilesystemAgentOptions {
  messages: ChatMessage[];
  sessionId: string;
  route: DiscoveryRoute;
  signals: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  flowStage?: FlowStage;
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
  options: FilesystemAgentOptions
): Promise<FilesystemAgentResponse> {
  const { messages, sessionId, route, signals, flowStage } = options;

  // Filter out any messages with empty content (causes API errors)
  const validMessages = messages.filter(
    (m) => m.content && m.content.trim().length > 0
  );

  if (validMessages.length === 0) {
    throw new Error("No valid messages to send");
  }

  const response = await fetch(`${API_BASE}/api/discovery/agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: validMessages,
      sessionId,
      route,
      signals,
      flowStage,
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
