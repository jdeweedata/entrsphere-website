import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Robot, FileJs, Path, Warning } from "@phosphor-icons/react/dist/ssr";
import DiscoveryRouterCTAWrapper from "@/components/discovery/DiscoveryRouterCTAWrapper";

export const metadata: Metadata = {
  title: "Discovery Router Toolkit - Turn Ideas into Production-Ready Specs",
  description:
    "The exact framework to turn vague 'I want an AI app' ideas into production-ready specifications in 30 minutes. R850 (~$47).",
};

const features = [
  "AI-guided deep-dive session tailored to your scenario",
  "Route-specific playbooks (A/B/C/D)",
  "Production-ready SPEC.json output",
  "Red flag detection and risk assessment",
  "Scope creep early warning system",
  "Integration complexity analysis",
];

const whatYouGet = [
  {
    icon: Robot,
    title: "Expert AI Discovery Agent",
    description: "Conducts a professional requirements interview, asks the right questions, and surfaces hidden complexity.",
  },
  {
    icon: Path,
    title: "4 Specialized Routes",
    description: "Standard, Exploratory, Stakeholder Alignment, and Integration - each with tailored playbooks.",
  },
  {
    icon: FileJs,
    title: "SPEC.json Output",
    description: "Developer-ready specification with user stories, acceptance criteria, risks, and technical constraints.",
  },
  {
    icon: Warning,
    title: "Red Flag Detection",
    description: "Proactive identification of scope creep signals, stakeholder misalignment, and technical risks.",
  },
];

export default function DiscoveryRouterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-16">
              <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                Most Popular
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Discovery Router Toolkit
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Stop wasting sprints on misunderstood requirements. Turn vague ideas into
                production-ready specs in 30 minutes with AI-guided discovery.
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-4xl font-bold text-slate-900">R850</span>
                <span className="text-lg text-slate-500">(~$47 USD)</span>
              </div>
              <p className="text-sm text-slate-500">One-time purchase, instant access</p>
            </div>

            {/* Features Grid */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check weight="bold" className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What You Get */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {whatYouGet.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-blue-600" weight="duotone" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Start Your Discovery Session
              </h2>
              <DiscoveryRouterCTAWrapper />
            </div>

            {/* Trust indicators */}
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-500">
                Secure payment via Payfast. Instant access after purchase.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
