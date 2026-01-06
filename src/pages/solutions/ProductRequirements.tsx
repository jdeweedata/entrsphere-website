import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, FileText, Code, ListChecks, Cpu } from "lucide-react";

const templates = [
  {
    icon: FileText,
    title: 'The "One-Pager" PRD Template',
    items: [
      "Perfect for fast features.",
      "Covers the Problem, Solution, and Success Metrics on a single view.",
      'Includes the "Anti-Goals" section (what we are NOT building) to stop scope creep instantly.',
    ],
  },
  {
    icon: Code,
    title: 'The "Heavy-Duty" Technical Spec',
    items: [
      "For deep integrations and backend work.",
      "Includes sections for Database Schema, API Endpoints, and Data Flow Diagrams.",
    ],
  },
  {
    icon: ListChecks,
    title: 'The "User Story" Formula',
    items: [
      'Stop writing "As a user, I want..." incorrectly.',
      'Includes our "Gherkin-Lite" Acceptance Criteria guide.',
      "Given [Context], When [Action], Then [Result]. Makes your specs testable by default.",
    ],
  },
  {
    icon: Cpu,
    title: "BONUS: The AI-Native SPEC.json Schema",
    items: [
      "The future of specs is machine-readable.",
      "Get the exact JSON structure we use to feed requirements into autonomous agents (Claude Code, Cursor, Windsurf).",
      "Turns your document into executable instructions.",
    ],
  },
];

const targetAudience = [
  {
    title: "Junior PMs",
    desc: "Look like a senior pro from Day 1.",
  },
  {
    title: "Founders",
    desc: 'Hand off your vision to devs without being asked "what about X?" 50 times a day.',
  },
  {
    title: "Consultants",
    desc: "Deliver a professional artifact that justifies your fee.",
  },
  {
    title: "Solo Devs",
    desc: "Force yourself to think through the logic before you start coding (saves rewriting code later).",
  },
];

const ProductRequirements = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-6">
          {/* Back Link */}
          <Link
            to="/solutions"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Solutions
          </Link>

          {/* Hero Section */}
          <div className="max-w-4xl mb-16">
            <span className="inline-block bg-slate-900 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              R485 (~$27)
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Write Specs Developers Actually Love to Read.
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              The standardized, fill-in-the-blank framework for creating clear,
              bulletproof Product Requirement Documents (PRDs) and User Stories.
            </p>
            <Button
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-lg"
            >
              <a
                href="https://paystack.com/pay/product-requirements"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get The Framework
              </a>
            </Button>
          </div>

          {/* Problem Section */}
          <section className="max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              "Where is that written down?"
            </h2>
            <p className="text-slate-600 mb-6">
              Most product documentation is a mess. It's scattered across Slack
              messages, vague Notion bullets, and "mental notes."
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                Developers have to guess how features should work.
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                Edge cases (like error states) get forgotten until production.
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                "Agile" becomes an excuse for having no plan at all.
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                AI coding tools (like Claude/Cursor) fail because your prompts
                are unstructured.
              </li>
            </ul>
            <p className="text-lg text-slate-800 font-medium mt-6">
              You can't build great software on a shaky foundation.
            </p>
          </section>

          {/* Solution Section */}
          <section className="max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              The Framework
            </h2>
            <p className="text-slate-600 mb-8">
              The <strong>EntrSphere Product Requirement Framework</strong> is
              not just a "template." It is a strict standard for defining
              software. It forces you to answer the hard questions{" "}
              <em>before</em> development starts, ensuring that every feature
              has a clear <strong>Happy Path</strong>,{" "}
              <strong>Sad Path</strong>, and{" "}
              <strong>Acceptance Criteria</strong>.
            </p>
            <p className="text-slate-600">
              It bridges the gap between "Business Talk" (what stakeholders
              want) and "Dev Talk" (what engineers need).
            </p>
          </section>

          {/* Deliverables Section */}
          <section className="max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What's Inside The Toolkit
            </h2>
            <p className="text-slate-600 mb-8">
              You get the exact templates we use to manage complex builds,
              available in <strong>Notion, Markdown, and PDF</strong> formats.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.title}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-slate-100 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <h3 className="font-bold text-slate-900">
                        {template.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {template.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-slate-600 text-sm"
                        >
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Target Audience */}
          <section className="max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Who Is This For?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {targetAudience.map((audience) => (
                <div
                  key={audience.title}
                  className="bg-white rounded-lg p-5 shadow-sm border border-slate-100"
                >
                  <h3 className="font-bold text-slate-900 mb-1">
                    {audience.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{audience.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Guarantee */}
          <section className="max-w-4xl mb-16">
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">The Guarantee</h2>
              <p className="text-slate-300">
                Use this framework on your next feature. If your developers
                don't say "This is the clearest spec I've ever seen," I'll
                refund your $27 immediately.
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Write Better Specs?
            </h2>
            <p className="text-slate-600 mb-8">
              Get the complete Product Requirement Framework and start writing
              specs developers love.
            </p>
            <Button
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-lg"
            >
              <a
                href="https://paystack.com/pay/product-requirements"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get The Framework — R485
              </a>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductRequirements;
