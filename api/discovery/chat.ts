import Anthropic from "@anthropic-ai/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DISCOVERY_ROUTER_SYSTEM_PROMPT, ROUTE_SPECIFIC_PROMPTS } from "../_lib/prompts.js";
import {
  selectModel,
  analyzeConversation,
  getModelParams,
  MODELS,
} from "../_lib/model-selector.js";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  sessionId: string;
  signals?: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  detectedRoute?: "A" | "B" | "C" | "D" | null;
  stream?: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Anthropic API key not configured" });
  }

  try {
    const body: RequestBody = req.body;
    const { messages, sessionId, signals, detectedRoute, stream = true } = body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    // Build context for model selection
    const currentSignals = signals || { A: 0, B: 0, C: 0, D: 0 };
    const context = analyzeConversation(
      messages.map((m) => ({ role: m.role, content: m.content })),
      currentSignals
    );

    // Select model based on context
    const model = selectModel(context);

    // Build system prompt with route-specific additions
    let systemPrompt = DISCOVERY_ROUTER_SYSTEM_PROMPT;
    if (detectedRoute && ROUTE_SPECIFIC_PROMPTS[detectedRoute]) {
      systemPrompt += "\n\n" + ROUTE_SPECIFIC_PROMPTS[detectedRoute];
    }

    // Add session context
    systemPrompt += `\n\n## Session Context
- Session ID: ${sessionId}
- Current Signals: A=${currentSignals.A.toFixed(2)}, B=${currentSignals.B.toFixed(2)}, C=${currentSignals.C.toFixed(2)}, D=${currentSignals.D.toFixed(2)}
- Detected Route: ${detectedRoute || "Not yet determined"}
- Model: ${model === MODELS.OPUS ? "Opus 4.5 (deep analysis)" : "Haiku 4.5 (standard)"}`;

    // Get model-specific parameters
    const modelParams = getModelParams(model);

    if (stream) {
      // Streaming response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const response = await anthropic.messages.stream({
        model,
        max_tokens: modelParams.max_tokens,
        system: [
          {
            type: "text",
            text: systemPrompt,
            // Enable prompt caching for system prompt (90% cost reduction)
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      // Stream the response
      for await (const event of response) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          const data = JSON.stringify({
            type: "text",
            text: event.delta.text,
          });
          res.write(`data: ${data}\n\n`);
        }
      }

      // Send final message with usage info
      const finalMessage = await response.finalMessage();
      const usage = {
        input_tokens: finalMessage.usage.input_tokens,
        output_tokens: finalMessage.usage.output_tokens,
        model,
        cache_read_input_tokens: (finalMessage.usage as { cache_read_input_tokens?: number }).cache_read_input_tokens || 0,
      };

      res.write(
        `data: ${JSON.stringify({ type: "done", usage, model })}\n\n`
      );
      res.end();
    } else {
      // Non-streaming response
      const response = await anthropic.messages.create({
        model,
        max_tokens: modelParams.max_tokens,
        system: [
          {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const textContent = response.content.find((c) => c.type === "text");
      const text = textContent?.type === "text" ? textContent.text : "";

      return res.status(200).json({
        content: text,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          model,
        },
      });
    }
  } catch (error) {
    console.error("Discovery chat error:", error);

    if (error instanceof Anthropic.APIError) {
      return res.status(error.status || 500).json({
        error: error.message,
        type: "api_error",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      type: "unknown_error",
    });
  }
}
