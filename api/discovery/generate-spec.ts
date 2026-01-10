import Anthropic from "@anthropic-ai/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SPEC_GENERATION_PROMPT } from "../_lib/prompts.js";
import { MODELS } from "../_lib/model-selector.js";

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
    const { messages, sessionId, route, projectContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    if (!route) {
      return res.status(400).json({ error: "Route is required" });
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

    // Always use Opus for SPEC generation (complex synthesis)
    const response = await anthropic.messages.create({
      model: MODELS.OPUS,
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
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ||
                        text.match(/```\n?([\s\S]*?)\n?```/) ||
                        [null, text];
      const jsonString = jsonMatch[1] || text;
      spec = JSON.parse(jsonString.trim());
    } catch {
      // Return raw text if JSON parsing fails
      return res.status(200).json({
        success: false,
        error: "Failed to parse SPEC.json",
        raw: text,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          model: MODELS.OPUS,
        },
      });
    }

    // Add metadata
    spec.meta = {
      generated_at: new Date().toISOString(),
      session_id: sessionId,
      route,
      model: MODELS.OPUS,
      tokens_used: response.usage.input_tokens + response.usage.output_tokens,
    };

    return res.status(200).json({
      success: true,
      spec,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        model: MODELS.OPUS,
      },
    });
  } catch (error) {
    console.error("SPEC generation error:", error);

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
