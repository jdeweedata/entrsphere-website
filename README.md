# EntrSphere Website

AI-Native Development Frameworks for modern product teams.

## Live Site

**Production**: https://www.entrsphere.com

## Features

### Discovery Agent (`/discovery`)
AI-powered project discovery tool that detects the right approach for your project:

- **Route A** - Standard Discovery: Clear requirements, needs documentation
- **Route B** - Exploratory: Vision needs clarifying, prototype-first
- **Route C** - Stakeholder Alignment: Multiple stakeholders with different priorities
- **Route D** - Integration Focus: Connecting existing systems/APIs

**Two Modes:**
- **Guided Mode**: 5-question flow with automatic route detection
- **AI Chat Mode**: Free-form conversation powered by Claude (filesystem agent pattern)

**Freemium SPEC.json Flow:**
- Generate SPEC preview with email capture
- Shows project summary + 2-3 key features
- Full SPEC.json requires upgrade to Discovery Toolkit

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**:
  - Vercel Serverless Functions (API routes)
  - Convex (database + real-time)
  - Anthropic Claude API (AI agent)
- **Analytics**: PostHog
- **Email**: Resend

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── discovery/
│   │   ├── agent.ts        # Filesystem agent (Claude + tools)
│   │   ├── chat.ts         # Streaming chat endpoint
│   │   ├── generate-spec.ts
│   │   └── generate-spec-preview.ts
│   └── _lib/
│       ├── prompts.ts      # System prompts
│       └── model-selector.ts
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema
│   └── discovery.ts        # Discovery mutations/queries
├── discovery-fs/           # Filesystem for agent context
│   ├── playbooks/          # Route-specific guides
│   ├── templates/          # SPEC schema, question banks
│   ├── knowledge/          # Red flags, scope creep signals
│   └── patterns/           # Route distribution data
├── src/
│   ├── components/
│   │   ├── discovery/      # Discovery Agent components
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Route pages
│   └── services/           # API service layer
└── public/
```

## Development

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server
npm run dev
```

### Environment Variables

```bash
# Anthropic (required for AI features)
ANTHROPIC_API_KEY=sk-ant-...

# Convex (required for database)
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Resend (optional, for emails)
RESEND_API_KEY=re_...

# PostHog (optional, for analytics)
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

### Commands

```bash
npm run dev       # Start dev server (port 8080)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Convex Commands

```bash
# Push schema changes to production
CONVEX_DEPLOYMENT="prod:small-sardine-868" npx convex deploy

# Open Convex dashboard
CONVEX_DEPLOYMENT="prod:small-sardine-868" npx convex dashboard
```

## Deployment

### Vercel (Frontend + API)
Push to `main` branch triggers automatic deployment.

### Convex (Database)
Schema changes require manual push:
```bash
CONVEX_DEPLOYMENT="prod:small-sardine-868" npx convex deploy
```

## Architecture Notes

### Filesystem Agent Pattern
Instead of custom RAG, the Discovery Agent uses a filesystem-based context management approach (inspired by [Vercel's blog post](https://vercel.com/blog/how-to-build-agents-with-filesystems-and-bash)):

- Agent has tools: `list_directory`, `read_file`, `search_files`, `write_session`
- Context is stored as markdown/JSON files in `discovery-fs/`
- Playbooks are preloaded into system prompt for faster responses

### Model Selection
- **Haiku 4.5**: SPEC preview generation (fast, cheap)
- **Sonnet 4.5**: Discovery chat, full SPEC generation (balanced)

## License

Proprietary - EntrSphere
