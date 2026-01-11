import fs from "fs/promises";
import path from "path";

const DISCOVERY_FS_PATH = path.join(process.cwd(), "discovery-fs");

export type DiscoveryRoute = "A" | "B" | "C" | "D";

interface PlaybookContent {
  route: DiscoveryRoute;
  name: string;
  content: string;
}

interface KnowledgeContent {
  type: "red-flags" | "scope-creep";
  content: string;
}

// Route file mappings
const PLAYBOOK_FILES: Record<DiscoveryRoute, string> = {
  A: "route-a-standard.md",
  B: "route-b-exploratory.md",
  C: "route-c-stakeholder.md",
  D: "route-d-integration.md",
};

const PLAYBOOK_NAMES: Record<DiscoveryRoute, string> = {
  A: "Standard Discovery",
  B: "Exploratory Discovery",
  C: "Stakeholder Alignment",
  D: "Integration Discovery",
};

/**
 * Load a route-specific playbook
 */
export async function loadPlaybook(route: DiscoveryRoute): Promise<PlaybookContent> {
  const filename = PLAYBOOK_FILES[route];
  const filepath = path.join(DISCOVERY_FS_PATH, "playbooks", filename);

  try {
    const content = await fs.readFile(filepath, "utf-8");
    return {
      route,
      name: PLAYBOOK_NAMES[route],
      content,
    };
  } catch (error) {
    console.error(`Failed to load playbook for route ${route}:`, error);
    return {
      route,
      name: PLAYBOOK_NAMES[route],
      content: `# Route ${route}: ${PLAYBOOK_NAMES[route]}\n\nPlaybook content could not be loaded.`,
    };
  }
}

/**
 * Load knowledge base content
 */
export async function loadKnowledge(
  type: "red-flags" | "scope-creep"
): Promise<KnowledgeContent> {
  const filename = type === "red-flags" ? "red-flags.md" : "scope-creep-signals.md";
  const filepath = path.join(DISCOVERY_FS_PATH, "knowledge", filename);

  try {
    const content = await fs.readFile(filepath, "utf-8");
    return { type, content };
  } catch (error) {
    console.error(`Failed to load knowledge base (${type}):`, error);
    return {
      type,
      content: `Knowledge base content (${type}) could not be loaded.`,
    };
  }
}

/**
 * Load the SPEC.json schema
 */
export async function loadSpecSchema(): Promise<object | null> {
  const filepath = path.join(DISCOVERY_FS_PATH, "templates", "spec-schema.json");

  try {
    const content = await fs.readFile(filepath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to load SPEC schema:", error);
    return null;
  }
}

/**
 * Load deep dive questions for a specific route
 */
export async function loadDeepDiveQuestions(): Promise<string> {
  const filepath = path.join(DISCOVERY_FS_PATH, "templates", "deep-dive-questions.md");

  try {
    const content = await fs.readFile(filepath, "utf-8");
    return content;
  } catch (error) {
    console.error("Failed to load deep dive questions:", error);
    return "";
  }
}

/**
 * Build enhanced context for the AI agent
 */
export async function buildAgentContext(route: DiscoveryRoute | null): Promise<string> {
  const parts: string[] = [];

  // Always load knowledge base
  const [redFlags, scopeCreep] = await Promise.all([
    loadKnowledge("red-flags"),
    loadKnowledge("scope-creep"),
  ]);

  parts.push("## Knowledge Base\n");
  parts.push("### Red Flags to Watch For\n");
  parts.push(redFlags.content);
  parts.push("\n### Scope Creep Signals\n");
  parts.push(scopeCreep.content);

  // Load route-specific playbook if route is known
  if (route) {
    const playbook = await loadPlaybook(route);
    parts.push(`\n## Current Playbook: ${playbook.name}\n`);
    parts.push(playbook.content);
  }

  // Load deep dive questions
  const questions = await loadDeepDiveQuestions();
  if (questions) {
    parts.push("\n## Deep Dive Question Bank\n");
    parts.push(questions);
  }

  return parts.join("\n");
}

/**
 * Get all available playbooks summary
 */
export async function getPlaybooksSummary(): Promise<
  Array<{ route: DiscoveryRoute; name: string; summary: string }>
> {
  const routes: DiscoveryRoute[] = ["A", "B", "C", "D"];
  const summaries = await Promise.all(
    routes.map(async (route) => {
      const playbook = await loadPlaybook(route);
      // Extract first paragraph after the title as summary
      const lines = playbook.content.split("\n");
      const summaryLines: string[] = [];
      let foundHeader = false;

      for (const line of lines) {
        if (line.startsWith("# ")) {
          foundHeader = true;
          continue;
        }
        if (foundHeader && line.trim()) {
          summaryLines.push(line);
          if (summaryLines.length >= 2) break;
        }
      }

      return {
        route,
        name: playbook.name,
        summary: summaryLines.join(" ").trim() || "Discovery playbook for this route.",
      };
    })
  );

  return summaries;
}
