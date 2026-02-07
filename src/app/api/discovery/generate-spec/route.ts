import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SPEC_GENERATION_PROMPT } from "../_lib/prompts";
import { MODELS } from "../_lib/model-selector";

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
  route: "A" | "B" | "C" | "D";
  projectContext?: {
    name?: string;
    description?: string;
  };
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
    const { messages, sessionId, route, projectContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array required" },
        { status: 400 }
      );
    }

    if (!route) {
      return NextResponse.json({ error: "Route is required" }, { status: 400 });
    }

    // Format the conversation transcript
    const transcript = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    // Build the generation prompt
    const userPrompt = `## Discovery Session Transcript

Session ID: ${sessionId}
Detected Route: ${route}
${projectContext?.name ? `Project Name: ${projectContext.name}` : ""}
${projectContext?.description ? `Initial Description: ${projectContext.description}` : ""}

---

${transcript}

---

Based on this discovery session, generate a comprehensive SPEC.json file.
Ensure all features, constraints, and integrations mentioned are captured.
Output ONLY the valid JSON object, no additional text.`;

    // Always use Sonnet for SPEC generation (complex synthesis)
    const response = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 8192,
      system: [
        {
          type: "text",
          text: SPEC_GENERATION_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    const text = textContent?.type === "text" ? textContent.text : "";

    // Try to parse the JSON
    let spec;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch =
        text.match(/```json\n?([\s\S]*?)\n?```/) ||
        text.match(/```\n?([\s\S]*?)\n?```/) ||
        [null, text];
      const jsonString = jsonMatch[1] || text;
      spec = JSON.parse(jsonString.trim());
    } catch {
      // Return raw text if JSON parsing fails
      return NextResponse.json({
        success: false,
        error: "Failed to parse SPEC.json",
        raw: text,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          model: MODELS.SONNET,
        },
      });
    }

    // Add metadata
    spec.meta = {
      generated_at: new Date().toISOString(),
      session_id: sessionId,
      route,
      model: MODELS.SONNET,
      tokens_used: response.usage.input_tokens + response.usage.output_tokens,
    };

    return NextResponse.json({
      success: true,
      spec,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        model: MODELS.SONNET,
      },
    });
  } catch (error) {
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
