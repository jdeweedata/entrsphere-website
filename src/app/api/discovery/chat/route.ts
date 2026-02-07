import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  DISCOVERY_ROUTER_SYSTEM_PROMPT,
  ROUTE_SPECIFIC_PROMPTS,
} from "../_lib/prompts";
import {
  selectModel,
  analyzeConversation,
  getModelParams,
  MODELS,
} from "../_lib/model-selector";

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

// Helper: Create streaming response to reduce nesting in main handler
function createStreamingResponse(
  client: Anthropic,
  model: string,
  modelParams: { max_tokens: number },
  systemPrompt: string,
  messages: ChatMessage[]
): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        await streamMessages(client, model, modelParams, systemPrompt, messages, encoder, controller);
      } catch (error) {
        console.error("Streaming error:", error);
        controller.error(error);
      }
    },
  });
}

// Helper: Stream messages and handle events
async function streamMessages(
  client: Anthropic,
  model: string,
  modelParams: { max_tokens: number },
  systemPrompt: string,
  messages: ChatMessage[],
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController
): Promise<void> {
  const response = await client.messages.stream({
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

  for await (const event of response) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      const data = JSON.stringify({ type: "text", text: event.delta.text });
      controller.enqueue(encoder.encode(`data: ${data}\n\n`));
    }
  }

  const finalMessage = await response.finalMessage();
  const usage = {
    input_tokens: finalMessage.usage.input_tokens,
    output_tokens: finalMessage.usage.output_tokens,
    model,
    cache_read_input_tokens:
      (finalMessage.usage as { cache_read_input_tokens?: number }).cache_read_input_tokens || 0,
  };

  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done", usage, model })}\n\n`));
  controller.close();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Anthropic API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body: RequestBody = await request.json();
    const { messages, sessionId, signals, detectedRoute, stream = true } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array required" },
        { status: 400 }
      );
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
- Model: ${model === MODELS.SONNET ? "Sonnet 4.5 (deep analysis)" : "Haiku 4.5 (standard)"}`;

    // Get model-specific parameters
    const modelParams = getModelParams(model);

    if (stream) {
      const streamResponse = createStreamingResponse(
        anthropic,
        model,
        modelParams,
        systemPrompt,
        messages
      );

      return new NextResponse(streamResponse, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
        },
      });
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

      return NextResponse.json({
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
      return NextResponse.json(
        { error: error.message, type: "api_error" },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", type: "unknown_error" },
      { status: 500 }
    );
  }
}
