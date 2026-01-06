import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Target, Zap, Users, Code, Lightbulb } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Process Over Hype",
    description:
      "Everyone's selling AI magic. We sell rigorous frameworks. The difference? Our stuff actually works in production.",
  },
  {
    icon: Zap,
    title: "Permissionless Leverage",
    description:
      "We help you build assets that work without you—code, systems, and media that scale while you sleep.",
  },
  {
    icon: Code,
    title: "Ship Fast, Ship Right",
    description:
      "Speed without chaos. Our frameworks eliminate the 'what did you mean?' meetings so you can build what matters.",
  },
  {
    icon: Lightbulb,
    title: "Clarity is the Product",
    description:
      "Vague requirements kill projects. We turn fuzzy ideas into specs so clear that AI agents can execute them.",
  },
];

const audience = [
  {
    title: "Solopreneurs",
    description:
      "You're building alone but thinking big. You need to move fast without breaking things or burning out. Our frameworks let you operate like a funded startup with a fraction of the resources.",
  },
  {
    title: "Small Agencies",
    description:
      "You're competing against teams 10x your size. You need to deliver enterprise-quality output without enterprise-level headcount. Our AI pipelines make your 5-person team perform like 20.",
  },
  {
    title: "Early-Stage Startups",
    description:
      "You're pre-revenue or bootstrapped. Every dollar and hour counts. You can't afford to build the wrong thing twice. Our discovery process ensures you build right the first time.",
  },
  {
    title: "Freelance Developers",
    description:
      "You're tired of scope creep eating your margins. You want to productize your expertise and charge for outcomes, not hours. Our frameworks turn your knowledge into sellable systems.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              We Help Small Teams Build Big Things
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              EntrSphere exists because we believe the best products shouldn't
              require the biggest teams. We build frameworks that let
              solopreneurs and small teams compete with—and beat—companies 100x
              their size.
            </p>
          </div>

          {/* The Problem We Solve */}
          <section className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              The Problem We Solve
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <p className="text-slate-700 mb-6">
                Here's what we see every day: Smart founders and developers with
                great ideas, stuck in "requirements hell." They have access to
                Claude, Cursor, GitHub Copilot—all the AI tools. But they're
                still missing deadlines.
              </p>
              <p className="text-slate-700 mb-6">Why?</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-slate-700">
                  <span className="text-red-500 mt-0.5">❌</span>
                  <span>
                    <strong>Vague requirements</strong> — "I'll know it when I
                    see it" is not a spec. AI can't build what you can't define.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <span className="text-red-500 mt-0.5">❌</span>
                  <span>
                    <strong>No discovery process</strong> — Jumping straight to
                    code means building the wrong thing faster.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <span className="text-red-500 mt-0.5">❌</span>
                  <span>
                    <strong>AI hype, no workflow</strong> — Tools don't ship
                    products. Processes do.
                  </span>
                </li>
              </ul>
              <p className="text-lg text-slate-800 font-medium">
                We don't sell AI hype. We sell the boring-but-essential
                frameworks that make AI actually useful in production.
              </p>
            </div>
          </section>

          {/* Our Philosophy */}
          <section className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Our Philosophy
            </h2>
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <blockquote className="text-2xl font-medium mb-6">
                "The prompt is not the product. The workflow is the product."
              </blockquote>
              <p className="text-slate-300 mb-6">
                Anyone can write a prompt. The hard part is building the
                end-to-end system: discovery → specification → development →
                testing → deployment. That's what separates weekend projects
                from production software.
              </p>
              <p className="text-slate-300">
                We believe in{" "}
                <strong className="text-white">permissionless leverage</strong>
                —building assets (code, systems, frameworks) that generate value
                without requiring more of your time. That's how small teams win.
              </p>
            </div>
          </section>

          {/* Who We Serve */}
          <section className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Who We Serve
              </h2>
              <p className="text-slate-600">
                We're not for everyone. We're for builders who are done trading
                time for money.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {audience.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-slate-700" />
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What We Offer */}
          <section className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              What We Offer
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      Discovery Router Toolkit
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Turn vague ideas into production-ready specs in 30
                      minutes. The exact framework we use to scope AI-native
                      products.
                    </p>
                  </div>
                  <Link
                    to="/solutions/discovery-router"
                    className="text-slate-900 font-medium hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      Product Requirement Framework
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Standardized templates for PRDs and User Stories that
                      developers actually love to read. Stop the guesswork.
                    </p>
                  </div>
                  <Link
                    to="/solutions/product-requirements"
                    className="text-slate-900 font-medium hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      Development Consulting
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Hands-on help implementing AI-native development
                      pipelines. From discovery audits to full autonomous dev
                      setups.
                    </p>
                  </div>
                  <Link
                    to="/solutions/consulting"
                    className="text-slate-900 font-medium hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="max-w-5xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              What We Believe
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                  >
                    <div className="bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* The Bottom Line */}
          <section className="max-w-4xl mx-auto mb-20">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
              <p className="text-slate-300 mb-6">
                You don't need a bigger team. You don't need more funding. You
                don't need the latest AI tool.
              </p>
              <p className="text-slate-300 mb-6">
                You need a process that turns your expertise into leverage—code,
                systems, and frameworks that work without you.
              </p>
              <p className="text-white text-lg font-medium">
                That's what we build. That's what we teach. That's EntrSphere.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Build Your Leverage?
            </h2>
            <p className="text-slate-600 mb-8">
              Whether you're a solopreneur with a big idea or an agency looking
              to scale output, we have a solution for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/solutions"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Solutions
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-lg font-medium border border-slate-200 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
