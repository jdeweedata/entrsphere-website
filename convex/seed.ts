import { mutation } from "./_generated/server";

const samplePosts = [
  {
    title: "How We Use AI Agents to Ship 3x Faster",
    slug: "how-we-use-ai-agents-to-ship-3x-faster",
    excerpt:
      "Discover how AI-powered development agents can dramatically accelerate your software delivery pipeline without sacrificing code quality.",
    content: `# How We Use AI Agents to Ship 3x Faster

The software development landscape is undergoing a fundamental shift. AI agents aren't just writing code—they're becoming integral teammates that help us think through problems, automate repetitive tasks, and ship features at unprecedented speed.

## The Old Way vs. The New Way

Traditional development cycles often look like this:
1. Gather requirements (1-2 weeks)
2. Design architecture (1 week)
3. Write code (2-4 weeks)
4. Test and debug (1-2 weeks)
5. Deploy and monitor (ongoing)

With AI agents integrated into our workflow, we've compressed this dramatically:
1. Discovery + Design with AI assistance (2-3 days)
2. AI-augmented development (1-2 weeks)
3. Automated testing with AI-generated test cases (2-3 days)
4. Continuous deployment (hours)

## Key Strategies We Use

### 1. Discovery Router Framework

Before writing a single line of code, we use our Discovery Router to ensure we're building the right thing. The AI helps us identify:
- Core problems to solve
- System dependencies
- Potential edge cases
- Success metrics

### 2. Spec-Driven Development

We generate detailed specification files that AI agents can consume:

\`\`\`json
{
  "feature": "user-authentication",
  "requirements": {
    "social_login": ["google", "github"],
    "session_management": "jwt",
    "rate_limiting": true
  }
}
\`\`\`

### 3. Continuous Code Review

AI agents review every pull request for:
- Security vulnerabilities
- Performance issues
- Code style consistency
- Test coverage gaps

## Results After 6 Months

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Time to MVP | 12 weeks | 4 weeks | 3x faster |
| Bug escape rate | 15% | 4% | 73% reduction |
| Developer satisfaction | 6.2/10 | 8.7/10 | 40% increase |

## Getting Started

If you're looking to integrate AI agents into your workflow:

1. **Start small** - Pick one repetitive task to automate
2. **Measure everything** - Track time saved and quality metrics
3. **Iterate rapidly** - AI tools improve weekly, stay updated
4. **Build muscle memory** - The more you use AI tools, the better you get at prompting

## Conclusion

AI agents aren't replacing developers—they're amplifying what great developers can do. The teams that learn to leverage these tools effectively will have a significant competitive advantage in the years to come.

Ready to accelerate your development process? [Contact us](/contact) to learn how EntrSphere can help your team ship faster with AI.`,
    coverImage: "/images/blog/ai-agents-shipping.jpg",
    category: "AI Automation",
    tags: ["ai-agents", "productivity", "development", "automation"],
    author: {
      name: "Jeffrey De Wee",
      avatar: "/images/jeffrey-dewee.jpg",
      bio: "Founder of EntrSphere. Building AI-powered tools for solopreneurs and SMBs.",
    },
    readTime: 6,
    metaTitle: "How AI Agents Help Us Ship Software 3x Faster | EntrSphere",
    metaDescription:
      "Learn how integrating AI agents into your development workflow can accelerate delivery by 3x while maintaining code quality.",
    featured: true,
  },
  {
    title: "The Discovery Router: Stop Building the Wrong Thing",
    slug: "discovery-router-stop-building-wrong-thing",
    excerpt:
      "90% of failed projects share one root cause: building before validating. Learn the 4-scenario framework that ensures you build what customers actually need.",
    content: `# The Discovery Router: Stop Building the Wrong Thing

Every founder has been there. Months of building, thousands of dollars spent, and then... crickets. Users don't engage. Customers don't pay. The product dies quietly.

The culprit? Building before understanding.

## The 4-Scenario Framework

The Discovery Router helps you determine which development path to take based on two key factors:

1. **Problem Clarity** - Do you truly understand the problem you're solving?
2. **Solution Clarity** - Do you know how to solve it?

This creates four distinct scenarios:

### Scenario 1: Clear Problem, Clear Solution (GREEN LIGHT)

**You know:** Exactly what problem exists and how to solve it
**Action:** Ship fast, validate with real users

Example: "Users can't export their data in CSV format. We need an export button."

### Scenario 2: Clear Problem, Unclear Solution (DISCOVERY MODE)

**You know:** The problem is real and painful
**You don't know:** The best way to solve it

**Action:** Research, prototype, experiment

Example: "Users struggle with onboarding, but we don't know why."

### Scenario 3: Unclear Problem, Clear Solution (VALIDATION MODE)

**You think:** You have a great solution
**You don't know:** If anyone actually has this problem

**Action:** Customer interviews, market research, competitor analysis

Example: "We built an AI scheduling tool, but no one's using it."

### Scenario 4: Unclear Problem, Unclear Solution (EXPLORATION MODE)

**You don't know:** Much of anything yet
**Action:** Immerse yourself in the problem space. Talk to 50 potential customers.

Example: "We want to help small businesses, but don't know where to start."

## How to Use the Discovery Router

Before any new feature or product:

\`\`\`markdown
## Discovery Router Assessment

### Problem Statement
[Write one sentence describing the problem]

### Problem Clarity Score (1-10): ___
- Have you talked to 5+ people with this problem?
- Can you quantify the pain (time, money, frustration)?
- Is the problem urgent or can people ignore it?

### Solution Clarity Score (1-10): ___
- Have you seen this solved elsewhere?
- Do you have the technical capability?
- Can you build an MVP in under 2 weeks?

### Scenario: [1/2/3/4]
### Recommended Action: _______________
\`\`\`

## Real-World Application

A client came to us wanting to build a "comprehensive business management platform." After running the Discovery Router:

- **Problem Clarity:** 3/10 (vague, no customer validation)
- **Solution Clarity:** 2/10 (massive scope, no clear path)
- **Scenario:** 4 (Exploration Mode)

**Our recommendation:** Don't build anything. Spend 2 weeks interviewing potential customers. They discovered their real opportunity was in invoice automation—a much smaller, more specific problem.

## The Cost of Skipping Discovery

| Project Type | With Discovery | Without Discovery |
|--------------|---------------|-------------------|
| Time to validate | 2 weeks | 3-6 months |
| Wasted code | < 5% | 60-80% |
| Pivot cost | Low | Catastrophic |
| Customer fit | High | Lucky guess |

## Start Using It Today

The Discovery Router isn't just a framework—it's a mindset shift. Every hour spent in discovery saves ten hours of building the wrong thing.

[Download our Discovery Router Toolkit](/solutions/discovery-router) to implement this framework in your organization.`,
    coverImage: "/images/blog/discovery-router.jpg",
    category: "AI Strategy",
    tags: ["product-management", "discovery", "validation", "frameworks"],
    author: {
      name: "Jeffrey De Wee",
      avatar: "/images/jeffrey-dewee.jpg",
      bio: "Founder of EntrSphere. Building AI-powered tools for solopreneurs and SMBs.",
    },
    readTime: 8,
    metaTitle: "The Discovery Router Framework: Stop Building Wrong Products",
    metaDescription:
      "Learn the 4-scenario framework that helps you validate ideas before building. Stop wasting time on products no one wants.",
    featured: false,
  },
  {
    title: "Integrating Claude Code Into Your CI/CD Pipeline",
    slug: "integrating-claude-code-cicd-pipeline",
    excerpt:
      "Step-by-step tutorial on adding AI-powered code review and generation to your GitHub Actions, GitLab CI, or Jenkins pipeline.",
    content: `# Integrating Claude Code Into Your CI/CD Pipeline

AI-assisted development isn't just about writing code faster—it's about catching issues earlier, generating better tests, and maintaining consistent code quality across your entire team.

This tutorial walks you through integrating Claude Code into your existing CI/CD pipeline.

## Prerequisites

Before we begin, ensure you have:
- A GitHub, GitLab, or Jenkins CI/CD setup
- An Anthropic API key
- Basic familiarity with YAML configuration

## Step 1: Set Up Environment Variables

First, store your API key securely:

### GitHub Actions

\`\`\`yaml
# In your repository settings, add:
# Settings > Secrets and variables > Actions
# Name: ANTHROPIC_API_KEY
# Value: sk-ant-xxxxx
\`\`\`

### GitLab CI

\`\`\`yaml
# Settings > CI/CD > Variables
# Key: ANTHROPIC_API_KEY
# Value: sk-ant-xxxxx
# Masked: Yes
\`\`\`

## Step 2: Create the Review Workflow

### GitHub Actions Example

\`\`\`yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get changed files
        id: changed
        run: |
          echo "files=$(git diff --name-only origin/main...HEAD | tr '\\n' ' ')" >> $GITHUB_OUTPUT

      - name: AI Review
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-code review \\
            --files "\${{ steps.changed.outputs.files }}" \\
            --output review-results.md

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review-results.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });
\`\`\`

## Step 3: Add Test Generation

Automatically generate tests for new code:

\`\`\`yaml
  generate-tests:
    runs-on: ubuntu-latest
    needs: review
    steps:
      - uses: actions/checkout@v4

      - name: Generate Missing Tests
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-code generate-tests \\
            --coverage-threshold 80 \\
            --output generated-tests/

      - name: Create PR with Generated Tests
        uses: peter-evans/create-pull-request@v5
        with:
          title: "🤖 Add AI-generated tests"
          body: "Automated test generation for new code"
          branch: ai-tests-\${{ github.sha }}
\`\`\`

## Step 4: Security Scanning

Add AI-powered security analysis:

\`\`\`yaml
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: AI Security Scan
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npx claude-code security-scan \\
            --severity high,critical \\
            --format sarif \\
            --output security-results.sarif

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: security-results.sarif
\`\`\`

## Best Practices

### 1. Rate Limiting

Avoid excessive API calls:

\`\`\`yaml
concurrency:
  group: ai-review-\${{ github.ref }}
  cancel-in-progress: true
\`\`\`

### 2. Caching

Cache AI responses for unchanged files:

\`\`\`yaml
- uses: actions/cache@v3
  with:
    path: .claude-cache
    key: claude-\${{ hashFiles('**/*.ts', '**/*.js') }}
\`\`\`

### 3. Selective Reviews

Only review meaningful changes:

\`\`\`yaml
on:
  pull_request:
    paths:
      - 'src/**'
      - '!**/*.test.ts'
      - '!**/*.md'
\`\`\`

## Monitoring and Metrics

Track your AI integration effectiveness:

| Metric | How to Measure | Target |
|--------|---------------|--------|
| Review accuracy | Manual spot-checks | > 90% relevant |
| False positive rate | Ignored suggestions | < 10% |
| Time saved | Compare to manual review | > 30 min/PR |
| Bug catch rate | Issues found pre-merge | Increasing trend |

## Troubleshooting

### Common Issues

**API Rate Limits**
\`\`\`yaml
retry:
  max_attempts: 3
  backoff: exponential
\`\`\`

**Large Files**
\`\`\`yaml
- name: Split large files
  run: npx claude-code chunk --max-tokens 8000
\`\`\`

## Conclusion

Integrating AI into your CI/CD pipeline is a force multiplier for your team. Start with code review, then expand to test generation and security scanning as you build confidence in the system.

Need help setting this up? [Schedule a consultation](/solutions/consulting) with our team.`,
    coverImage: "/images/blog/cicd-tutorial.jpg",
    category: "Tutorials",
    tags: ["cicd", "github-actions", "automation", "devops", "claude"],
    author: {
      name: "Jeffrey De Wee",
      avatar: "/images/jeffrey-dewee.jpg",
      bio: "Founder of EntrSphere. Building AI-powered tools for solopreneurs and SMBs.",
    },
    readTime: 12,
    metaTitle: "Integrate Claude AI Into Your CI/CD Pipeline | Tutorial",
    metaDescription:
      "Step-by-step guide to adding AI-powered code review, test generation, and security scanning to GitHub Actions, GitLab CI, or Jenkins.",
    featured: false,
  },
];

export const seedPosts = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Check if posts already exist
    const existingPosts = await ctx.db.query("posts").collect();
    if (existingPosts.length > 0) {
      return { message: "Posts already seeded", count: existingPosts.length };
    }

    const insertedIds = [];

    for (let i = 0; i < samplePosts.length; i++) {
      const post = samplePosts[i];
      const id = await ctx.db.insert("posts", {
        ...post,
        // Stagger publish dates (most recent first for featured post)
        publishedAt: now - i * 7 * 24 * 60 * 60 * 1000, // 7 days apart
        createdAt: now - i * 7 * 24 * 60 * 60 * 1000,
        updatedAt: now,
      });
      insertedIds.push(id);
    }

    return { message: "Posts seeded successfully", count: insertedIds.length };
  },
});

// Clear all posts (for development)
export const clearPosts = mutation({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();
    for (const post of posts) {
      await ctx.db.delete(post._id);
    }
    return { message: "All posts cleared", count: posts.length };
  },
});
