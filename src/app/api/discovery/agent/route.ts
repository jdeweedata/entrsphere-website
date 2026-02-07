import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";
import { MODELS } from "../_lib/model-selector";
import { FILESYSTEM_AGENT_PROMPT } from "../_lib/prompts";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Convex client for conversation logging
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// Flow stages for latent demand analysis
type FlowStage = "routing" | "discovery" | "post_spec" | "ask_anything" | "refinement";

// Log a message to Convex (fire and forget - don't block on this)
async function logConversation(
  sessionId: string,
  role: "user" | "assistant" | "tool_call" | "tool_result",
  content: string,
  flowStage?: FlowStage,
  route?: "A" | "B" | "C" | "D" | null,
  toolName?: string,
  toolSuccess?: boolean,
  errorMessage?: string
): Promise<void> {
  if (!convex) return;

  try {
    await convex.mutation(api.conversations.logMessage, {
      sessionId,
      role,
      content: content.slice(0, 10000), // Limit content size
      flowStage,
      route: route || undefined,
      toolName,
      toolSuccess,
      errorMessage,
    });
  } catch {
    // Don't fail the request if logging fails
  }
}

// Filesystem root for the discovery agent (sandboxed)
const FS_ROOT = path.join(process.cwd(), "discovery-fs");

// Tool definitions for the filesystem agent
const TOOLS: Anthropic.Tool[] = [
  {
    name: "list_directory",
    description:
      "List contents of a directory. Use this to explore the filesystem structure. Returns file/folder names with types.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            "Path relative to discovery-fs root. Use '/' for root, '/playbooks' for playbooks folder, etc.",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "read_file",
    description:
      "Read the contents of a file. Use this to load playbooks, templates, session data, or knowledge base content.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            "Path to the file relative to discovery-fs root, e.g., '/playbooks/route-a-standard.md'",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "search_files",
    description:
      "Search for text content across files. Like grep -r. Use this to find relevant sessions, patterns, or knowledge.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Text to search for (case-insensitive)",
        },
        directory: {
          type: "string",
          description:
            "Directory to search in, relative to root. Default '/' searches everything.",
        },
        file_pattern: {
          type: "string",
          description:
            "Optional file extension filter, e.g., '.md' or '.json'. Leave empty for all files.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "write_session",
    description:
      "Write or update a session file. Use this to save session transcripts, answers, or metadata.",
    input_schema: {
      type: "object" as const,
      properties: {
        session_id: {
          type: "string",
          description: "Session ID (e.g., 'sess_abc123')",
        },
        filename: {
          type: "string",
          description:
            "File to write: 'meta.json', 'transcript.md', 'answers.json', or 'spec.json'",
        },
        content: {
          type: "string",
          description: "Content to write to the file",
        },
      },
      required: ["session_id", "filename", "content"],
    },
  },
];

// Resolve path safely within sandbox
function resolvePath(relativePath: string): string {
  const normalized = path.normalize(relativePath).replace(/^[/\\]+/, "");
  const resolved = path.join(FS_ROOT, normalized);

  // Security: ensure we stay within FS_ROOT
  if (!resolved.startsWith(FS_ROOT)) {
    throw new Error("Path traversal attempt blocked");
  }

  return resolved;
}

// Tool implementations
async function listDirectory(dirPath: string): Promise<string> {
  try {
    const resolved = resolvePath(dirPath);
    const entries = await fs.readdir(resolved, { withFileTypes: true });

    const formatted = entries.map((entry) => {
      const type = entry.isDirectory() ? "[DIR]" : "[FILE]";
      return `${type} ${entry.name}`;
    });

    return formatted.length > 0 ? formatted.join("\n") : "(empty directory)";
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return `Error: Directory not found: ${dirPath}`;
    }
    throw error;
  }
}

async function readFile(filePath: string): Promise<string> {
  try {
    const resolved = resolvePath(filePath);
    const content = await fs.readFile(resolved, "utf-8");
    return content;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return `Error: File not found: ${filePath}`;
    }
    throw error;
  }
}

async function searchFiles(
  query: string,
  directory: string = "/",
  filePattern?: string
): Promise<string> {
  const results: string[] = [];
  const searchDir = resolvePath(directory);
  const lowerQuery = query.toLowerCase();

  async function searchRecursive(dir: string): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await searchRecursive(fullPath);
        } else if (entry.isFile()) {
          // Apply file pattern filter
          if (filePattern && !entry.name.endsWith(filePattern)) {
            continue;
          }

          try {
            const content = await fs.readFile(fullPath, "utf-8");
            const lines = content.split("\n");

            for (let i = 0; i < lines.length; i++) {
              if (lines[i].toLowerCase().includes(lowerQuery)) {
                const relativePath = fullPath.replace(FS_ROOT, "");
                results.push(`${relativePath}:${i + 1}: ${lines[i].trim()}`);

                // Limit results per file
                if (results.length >= 50) break;
              }
            }
          } catch {
            // Skip files that can't be read
          }
        }

        if (results.length >= 50) break;
      }
    } catch {
      // Skip directories that can't be read
    }
  }

  await searchRecursive(searchDir);

  return results.length > 0
    ? results.join("\n")
    : `No matches found for "${query}"`;
}

async function writeSession(
  sessionId: string,
  filename: string,
  content: string
): Promise<string> {
  // Validate filename
  const allowedFiles = [
    "meta.json",
    "transcript.md",
    "answers.json",
    "spec.json",
  ];
  if (!allowedFiles.includes(filename)) {
    return `Error: Invalid filename. Allowed: ${allowedFiles.join(", ")}`;
  }

  // Validate session ID format
  if (!sessionId.match(/^sess_[a-zA-Z0-9]+$/)) {
    return "Error: Invalid session ID format. Use 'sess_' followed by alphanumeric characters.";
  }

  try {
    const sessionDir = resolvePath(`/sessions/${sessionId}`);
    await fs.mkdir(sessionDir, { recursive: true });

    const filePath = path.join(sessionDir, filename);
    await fs.writeFile(filePath, content, "utf-8");

    return `Successfully wrote ${filename} for session ${sessionId}`;
  } catch (error) {
    return `Error writing file: ${(error as Error).message}`;
  }
}

// Process tool calls
async function processToolCall(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "list_directory":
      return await listDirectory(input.path as string);

    case "read_file":
      return await readFile(input.path as string);

    case "search_files":
      return await searchFiles(
        input.query as string,
        (input.directory as string) || "/",
        input.file_pattern as string | undefined
      );

    case "write_session":
      return await writeSession(
        input.session_id as string,
        input.filename as string,
        input.content as string
      );

    default:
      return `Unknown tool: ${name}`;
  }
}

// Helper: Process all tool use blocks and return results
async function processToolUseBlocks(
  content: Anthropic.ContentBlock[],
  sessionId: string,
  flowStage?: FlowStage,
  route?: "A" | "B" | "C" | "D" | null
): Promise<Anthropic.ToolResultBlockParam[]> {
  const toolUseBlocks = content.filter(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  const toolResults: Anthropic.ToolResultBlockParam[] = [];

  for (const toolUse of toolUseBlocks) {
    const result = await processSingleToolUse(toolUse, sessionId, flowStage, route);
    toolResults.push(result);
  }

  return toolResults;
}

// Helper: Process a single tool use and log it
async function processSingleToolUse(
  toolUse: Anthropic.ToolUseBlock,
  sessionId: string,
  flowStage?: FlowStage,
  route?: "A" | "B" | "C" | "D" | null
): Promise<Anthropic.ToolResultBlockParam> {
  // Log tool call
  logConversation(
    sessionId,
    "tool_call",
    JSON.stringify({ name: toolUse.name, input: toolUse.input }),
    flowStage,
    route,
    toolUse.name
  );

  const result = await processToolCall(
    toolUse.name,
    toolUse.input as Record<string, unknown>
  );

  const toolSuccess = !result.startsWith("Error:");

  // Log tool result
  logConversation(
    sessionId,
    "tool_result",
    result.slice(0, 5000),
    flowStage,
    route,
    toolUse.name,
    toolSuccess,
    toolSuccess ? undefined : result
  );

  return {
    type: "tool_result",
    tool_use_id: toolUse.id,
    content: result,
  };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  sessionId: string;
  route?: "A" | "B" | "C" | "D" | null;
  signals?: { A: number; B: number; C: number; D: number };
  flowStage?: FlowStage;
}

// Preload playbook content based on route to reduce tool calls
async function getPreloadedContext(
  route: string | null | undefined
): Promise<string> {
  const routeMap: Record<string, string> = {
    A: "route-a-standard.md",
    B: "route-b-exploratory.md",
    C: "route-c-stakeholder.md",
    D: "route-d-integration.md",
  };

  let preloaded = "\n\n## Preloaded Context\n";

  // Always load knowledge base
  try {
    const redFlags = await readFile("/knowledge/red-flags.md");
    if (!redFlags.startsWith("Error:")) {
      preloaded +=
        "\n### Red Flags (loaded)\n" + redFlags.slice(0, 2000) + "...\n";
    }
  } catch {
    /* ignore */
  }

  // Load route-specific playbook if route is known
  if (route && routeMap[route]) {
    try {
      const playbook = await readFile(`/playbooks/${routeMap[route]}`);
      if (!playbook.startsWith("Error:")) {
        preloaded += `\n### Route ${route} Playbook (loaded)\n${playbook}\n`;
      }
    } catch {
      /* ignore */
    }
  }

  return preloaded;
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
    const { messages, sessionId, route, signals, flowStage } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array required" },
        { status: 400 }
      );
    }

    // Log incoming user message (fire and forget - don't await)
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === "user") {
      logConversation(
        sessionId,
        "user",
        lastUserMessage.content,
        flowStage,
        route
      );
    }

    // Build context for the agent
    const contextInfo = route
      ? `Current session: ${sessionId}\nDetected route: ${route} (signals: A=${signals?.A?.toFixed(2)}, B=${signals?.B?.toFixed(2)}, C=${signals?.C?.toFixed(2)}, D=${signals?.D?.toFixed(2)})`
      : `Current session: ${sessionId}\nRoute not yet detected.`;

    // Preload relevant playbook to reduce tool call latency
    const preloadedContext = await getPreloadedContext(route);

    // Convert messages to Anthropic format
    const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Add context as first user message if not already present
    if (anthropicMessages.length === 1) {
      anthropicMessages[0] = {
        role: "user",
        content: `${contextInfo}\n\nUser message: ${anthropicMessages[0].content}`,
      };
    }

    // Build system prompt with preloaded context
    const systemPromptWithContext = FILESYSTEM_AGENT_PROMPT + preloadedContext;

    // Agentic loop - let the model use tools until it's done
    let continueLoop = true;
    let response: Anthropic.Message | null = null;
    let currentMessages = [...anthropicMessages];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let iterations = 0;
    const maxIterations = 5; // Allow enough iterations for tool calls + final text response

    while (continueLoop && iterations < maxIterations) {
      iterations++;

      response = await anthropic.messages.create({
        model: MODELS.SONNET,
        max_tokens: 4096,
        system: systemPromptWithContext,
        tools: TOOLS,
        messages: currentMessages,
      });

      totalInputTokens += response.usage.input_tokens;
      totalOutputTokens += response.usage.output_tokens;

      // Model finished - exit loop
      if (response.stop_reason !== "tool_use") {
        continueLoop = false;
        continue;
      }

      // Process tool calls
      const toolResults = await processToolUseBlocks(
        response.content,
        sessionId,
        flowStage,
        route
      );

      // Add assistant message and tool results to continue the conversation
      currentMessages.push({
        role: "assistant",
        content: response.content,
      });

      currentMessages.push({
        role: "user",
        content: toolResults,
      });
    }

    // Extract final text response
    const textContent = response?.content.find((c) => c.type === "text");
    let finalText = textContent?.type === "text" ? textContent.text : "";

    // Ensure we never return empty content (causes API errors on subsequent calls)
    if (!finalText || !finalText.trim()) {
      finalText = "I'm processing your request. Please continue with your next question or provide more details.";
    }

    // Log assistant response (fire and forget)
    logConversation(
      sessionId,
      "assistant",
      finalText,
      flowStage,
      route
    );

    return NextResponse.json({
      content: finalText,
      usage: {
        input_tokens: totalInputTokens,
        output_tokens: totalOutputTokens,
        iterations,
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
