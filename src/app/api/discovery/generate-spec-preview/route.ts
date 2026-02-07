import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { PREVIEW_PROMPT } from "../_lib/prompts";
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
  email: string;
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
    const { messages, sessionId, route, email } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array required" },
        { status: 400 }
      );
    }

    if (!route) {
      return NextResponse.json({ error: "Route is required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required for preview" },
        { status: 400 }
      );
    }

    // Format the conversation transcript (abbreviated for preview)
    const transcript = messages
      .slice(-6) // Only last 6 messages for preview
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    // Build the generation prompt
    const userPrompt = `## Discovery Session Summary

Session ID: ${sessionId}
Detected Route: ${route}

---

${transcript}

---

Generate a PREVIEW SPEC.json based on this discovery conversation.
Output ONLY the valid JSON object.`;

    // Use Haiku for preview (fast, cheap)
    const response = await anthropic.messages.create({
      model: MODELS.HAIKU,
      max_tokens: 1024,
      system: PREVIEW_PROMPT,
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
    let preview;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch =
        text.match(/```json\n?([\s\S]*?)\n?```/) ||
        text.match(/```\n?([\s\S]*?)\n?```/) ||
        [null, text];
      const jsonString = jsonMatch[1] || text;
      preview = JSON.parse(jsonString.trim());
    } catch {
      // Return raw text if JSON parsing fails
      return NextResponse.json({
        success: false,
        error: "Failed to parse preview",
        raw: text,
      });
    }

    // Add metadata
    preview.meta = {
      generated_at: new Date().toISOString(),
      session_id: sessionId,
      route,
      email_captured: email,
      model: MODELS.HAIKU,
    };

    return NextResponse.json({
      success: true,
      preview,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        model: MODELS.HAIKU,
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
