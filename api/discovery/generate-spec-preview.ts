import Anthropic from "@anthropic-ai/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MODELS } from "../_lib/model-selector.js";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simplified prompt for preview generation (faster, cheaper)
const PREVIEW_PROMPT = `You are a requirements analyst generating a PREVIEW of a SPEC.json file.

Generate a LIMITED preview with:
1. Project summary (name, description, route)
2. ONLY 2-3 key features identified (not full details)
3. A "locked" indicator showing there's more content

Output ONLY valid JSON in this exact structure:
{
  "preview": true,
  "project": {
    "name": "string - inferred project name",
    "summary": "string - 1-2 sentence summary",
    "route": "A|B|C|D",
    "status": "preview"
  },
  "features_preview": [
    {
      "id": "F001",
      "title": "string - feature title",
      "priority": "must-have|nice-to-have"
    }
  ],
  "locked_content": {
    "full_features_count": number,
    "has_integrations": boolean,
    "has_constraints": boolean,
    "has_risks": boolean,
    "has_acceptance_criteria": boolean
  },
  "upgrade_cta": "Unlock full SPEC.json with detailed requirements, acceptance criteria, and technical specifications"
}

Keep the preview SHORT and enticing - show value but leave them wanting more.`;

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
    const { messages, sessionId, route, email } = body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    if (!route) {
      return res.status(400).json({ error: "Route is required" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email is required for preview" });
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
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ||
                        text.match(/```\n?([\s\S]*?)\n?```/) ||
                        [null, text];
      const jsonString = jsonMatch[1] || text;
      preview = JSON.parse(jsonString.trim());
    } catch {
      // Return raw text if JSON parsing fails
      return res.status(200).json({
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

    return res.status(200).json({
      success: true,
      preview,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        model: MODELS.HAIKU,
      },
    });
  } catch (error) {
    console.error("SPEC preview generation error:", error);

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
