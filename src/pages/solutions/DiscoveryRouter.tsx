import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";

const scenarios = [
  {
    name: "A. Standard",
    signal: '"I know exactly what I need."',
    fix: "Generate a rigorous PRD & SPEC.json immediately.",
  },
  {
    name: "B. Exploratory",
    signal: '"I\'ll know it when I see it."',
    fix: "Stop talking. Build a 5-min disposable prototype.",
  },
  {
    name: "C. Strategic",
    signal: '"It depends / I\'m not sure."',
    fix: 'Stop. This is a political trap. Use the "Ambiguity Prompt" to force a decision.',
  },
  {
    name: "D. Integration",
    signal: '"It needs to talk to Salesforce."',
    fix: "Run dual-track discovery (Business + Tech) to prevent integration hell.",
  },
];

const deliverables = [
  {
    title: "The Discovery Router Prompt (Markdown)",
    items: [
      'The "Master Brain" prompt that interviews your stakeholders for you.',
      "Automatically detects which of the 4 scenarios you are in.",
      "Routes the conversation to the correct follow-up questions.",
    ],
  },
  {
    title: "The 4 Specialized Sub-Prompts",
    items: [
      "Non-Technical Discovery: For stakeholders who don't speak code.",
      'Exploratory Prototype: For "vague idea" people.',
      "Strategic Ambiguity: For navigating political blockers.",
      "Integration Discovery: For complex legacy system connections.",
    ],
  },
  {
    title: "The PRD & SPEC.json Generators",
    items: [
      "Turn any interview transcript into a professional Product Requirements Document (PRD).",
      "Generate a machine-readable SPEC.json file that you can feed directly into AI coding tools.",
    ],
  },
  {
    title: "The Moat Analysis Framework",
    items: [
      "A bonus guide to ensure you aren't just building a wrapper.",
      "Build a defensible product with workflow integration and data loops.",
    ],
  },
];

const targetAudience = [
  {
    title: "Freelance Developers",
    desc: "Stop doing free consulting. Charge for discovery.",
  },
  {
    title: "Agency Owners",
    desc: "Standardize how your PMs scope projects.",
  },
  {
    title: "Founders",
    desc: "Validate your idea before hiring a dev team.",
  },
  {
    title: "Product Managers",
    desc: "Get stakeholders to commit to a direction in record time.",
  },
];

const DiscoveryRouter = () => {
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
              R850 (~$47)
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Stop Guessing Requirements. Start Building the Right Product.
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              The exact framework I use to turn vague "I want an AI app" ideas
              into production-ready specifications in 30 minutes.
            </p>
            <Button
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-lg"
            >
              <a
                href="https://paystack.com/pay/discovery-router"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy Toolkit
              </a>
            </Button>
          </div>

          {/* Problem Section */}
          <section className="max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              "I'll know it when I see it."
            </h2>
            <p className="text-slate-600 mb-6">
              Every developer dreads this phrase. It means:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                Endless meetings that go in circles.
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                "Scope creep" that kills your margins.
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                Building a full MVP only to hear, "That's not what I meant."
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                Dealing with "Strategic Ambiguity"—when stakeholders hide
                political blockers behind vague feature requests.
              </li>
            </ul>
            <p className="text-lg text-slate-800 font-medium mt-6">
              You don't have a coding problem. You have a{" "}
              <strong>Discovery Problem</strong>.
            </p>
          </section>

          {/* Solution Section - 4 Scenario Router */}
          <section className="max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              The 4-Scenario Router
            </h2>
            <p className="text-slate-600 mb-8">
              I built a proprietary "Discovery Router" that acts like a triage
              nurse for product ideas. It forces every project into one of 4
              proven tracks before a single line of code is written:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left p-4 font-semibold">Scenario</th>
                    <th className="text-left p-4 font-semibold">The Signal</th>
                    <th className="text-left p-4 font-semibold">The Fix</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((scenario, index) => (
                    <tr
                      key={scenario.name}
                      className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}
                    >
                      <td className="p-4 font-medium text-slate-900">
                        {scenario.name}
                      </td>
                      <td className="p-4 text-slate-600 italic">
                        {scenario.signal}
                      </td>
                      <td className="p-4 text-slate-700">{scenario.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Deliverables Section */}
          <section className="max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What's Inside The Toolkit
            </h2>
            <p className="text-slate-600 mb-8">
              This is not a "course." It is a copy-paste operating system for
              your product scoping.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {deliverables.map((deliverable, index) => (
                <div
                  key={deliverable.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                >
                  <h3 className="font-bold text-slate-900 mb-4">
                    {index + 1}. {deliverable.title}
                  </h3>
                  <ul className="space-y-2">
                    {deliverable.items.map((item) => (
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
              ))}
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
                If this toolkit doesn't save you at least 10 hours of wasted
                meeting time on your next project, reply to your receipt email
                for a 100% refund. No questions asked.
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Stop Guessing?
            </h2>
            <p className="text-slate-600 mb-8">
              Get the complete Discovery Router Toolkit and start building the
              right product today.
            </p>
            <Button
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-lg"
            >
              <a
                href="https://paystack.com/pay/discovery-router"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy Toolkit — R850
              </a>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiscoveryRouter;
