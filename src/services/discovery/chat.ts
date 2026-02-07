// Chat API - streaming and non-streaming chat with Claude

import { DiscoveryRoute } from "@/types/discovery";
import { API_BASE } from "./client";
import { ChatMessage, Signals, StreamEvent, UsageInfo } from "./types";

// Options for chat requests
export interface ChatOptions {
  messages: ChatMessage[];
  sessionId: string;
  signals: Signals;
  detectedRoute: DiscoveryRoute;
}

/**
 * Start a full discovery session with Claude API
 * Uses streaming for real-time responses
 */
export async function* streamDiscoveryChat(
  options: ChatOptions
): AsyncGenerator<StreamEvent> {
  const { messages, sessionId, signals, detectedRoute } = options;

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
  options: ChatOptions
): Promise<{
  content: string;
  usage: UsageInfo;
}> {
  const { messages, sessionId, signals, detectedRoute } = options;

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
