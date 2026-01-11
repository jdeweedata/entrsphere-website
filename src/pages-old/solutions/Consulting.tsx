import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, MagnifyingGlass, Users, Gear } from "@phosphor-icons/react";

const services = [
  {
    icon: MagnifyingGlass,
    title: 'The "Discovery Pipeline" Audit',
    subtitle: "For Teams Struggling with Requirements",
    price: "R25,000",
    priceNote: "One-time engagement",
    description:
      "I will audit your current product scoping process and implement the EntrSphere 4-Scenario Framework directly into your workflow.",
    deliverables: [
      "Review of your last 3 PRDs/Specs (and why they failed/succeeded).",
      'Customization of the "Discovery Router" for your specific business domain.',
      'Training session for your Product Managers on how to use the "Non-Technical Discovery Prompt."',
      "Deliverable: A bespoke DISCOVERY_PLAYBOOK.md for your team.",
    ],
  },
  {
    icon: Users,
    title: 'The "Integration Discovery" Workshop',
    subtitle: "For Complex/Legacy System Projects",
    price: "R45,000",
    priceNote: "Project-based",
    description:
      'If you are building AI features that must talk to old databases, messy APIs, or "Spaghetti Code," this workshop saves you months of pain. We run the Dual-Track Discovery process (Business + Technical) to map every dependency before you code.',
    deliverables: [
      "2-Day Virtual Workshop with stakeholders and architects.",
      "Full mapping of all system touchpoints and data flows.",
      'Identification of "Strategic Ambiguity" risks (political blockers).',
      "Deliverable: A complete INTEGRATION_SPEC.json ready for development.",
    ],
  },
  {
    icon: Gear,
    title: "Custom AI Development Pipeline",
    subtitle: "For Teams Ready to Automate",
    price: "Custom Quote",
    priceNote: "Retainer or Fixed Bid",
    description:
      "I will set up the technical infrastructure to let autonomous agents (like Claude Code/Ralph Wiggum) safely contribute to your codebase.",
    deliverables: [
      "CI/CD Setup: GitHub Actions/GitLab pipelines that run AI agents in isolation.",
      'Guardrails: Implementation of "Retry & Quarantine" logic for flaky tests (so AI doesn\'t break your build).',
      "Cost Optimization: Setup of OAuth tokens and caching to prevent API bill shock.",
      'Deliverable: A working "Autonomous Dev" branch in your repo.',
    ],
  },
];

const Consulting = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <SEO
        title="AI Development Consulting - Build AI-Native Products Without Chaos"
        description="Expert consulting to implement AI-native development pipelines. Discovery audits, integration workshops, and custom AI development. From R25,000 (~$1,500)."
        canonical="/solutions/consulting"
      />
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-6">
          {/* Back Link */}
          <Link
            to="/solutions"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
          >
            <ArrowLeft weight="duotone" className="h-4 w-4 mr-2" />
            Back to Solutions
          </Link>

          {/* Hero Section */}
          <div className="max-w-4xl mb-16">
            <span className="inline-block bg-slate-900 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              From R25,000 (~$1,500)
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Build AI-Native Products Without the Chaos.
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Expert consulting to help your team implement the EntrSphere
              discovery-to-deployment pipeline. Stop guessing requirements and
              start shipping.
            </p>
            <Button
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-lg"
            >
              <Link to="/contact">Book a Strategy Call</Link>
            </Button>
          </div>

          {/* Problem Section */}
          <section className="max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              "We have the tools, but not the process."
            </h2>
            <p className="text-slate-600 mb-6">
              Your team has access to Claude, GitHub Copilot, and fancy CI/CD
              tools. But you're still missing deadlines.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                "AI-generated code" is creating more technical debt than
                features.
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                Stakeholders and developers are speaking different languages.
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <span className="text-red-500 mt-0.5">❌</span>
                You're spending weeks "fixing" what the AI built because the
                requirements were vague.
              </li>
            </ul>
            <p className="text-lg text-slate-800 font-medium mt-6">
              You don't need more tools. You need a{" "}
              <strong>Pipeline Strategy</strong>.
            </p>
          </section>

          {/* Services Section */}
          <section className="max-w-5xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Consulting Services
            </h2>

            <div className="space-y-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="bg-slate-100 p-3 rounded-xl w-fit">
                        <Icon weight="duotone" className="h-6 w-6 text-slate-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {service.title}
                            </h3>
                            <p className="text-slate-500">{service.subtitle}</p>
                          </div>
                          <div className="text-left md:text-right">
                            <p className="text-xl font-bold text-slate-900">
                              {service.price}
                            </p>
                            <p className="text-sm text-slate-500">
                              {service.priceNote}
                            </p>
                          </div>
                        </div>
                        <p className="text-slate-600 mb-6">
                          {service.description}
                        </p>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">
                            What You Get:
                          </h4>
                          <ul className="space-y-2">
                            {service.deliverables.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-slate-600"
                              >
                                <Check weight="bold" className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Why EntrSphere */}
          <section className="max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Why EntrSphere?
            </h2>
            <p className="text-slate-600 mb-6">
              Most consultants sell "AI Hype." I sell{" "}
              <strong>Process Engineering.</strong>
            </p>
            <p className="text-slate-600 mb-8">
              I don't just "prompt" AI models. I build the rigorous frameworks
              (Discovery → Spec → Code → Test) that allow AI models to actually
              deliver value in a production environment.
            </p>
            <blockquote className="bg-slate-900 text-white rounded-2xl p-8">
              <p className="text-xl font-medium mb-4">My Philosophy:</p>
              <p className="text-slate-300 text-lg italic">
                "The prompt is not the product. The workflow is the product."
              </p>
            </blockquote>
          </section>

          {/* Final CTA */}
          <section className="max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Build Without the Chaos?
            </h2>
            <p className="text-slate-600 mb-8">
              Let's discuss how we can implement AI-native development practices
              in your organization.
            </p>
            <Button
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-lg"
            >
              <Link to="/contact">Book a Strategy Call</Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Consulting;
