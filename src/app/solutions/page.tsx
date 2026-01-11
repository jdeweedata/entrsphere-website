import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Solutions - Build What Your Clients Actually Need",
  description:
    "Turn vague ideas into specs so clear, developers build exactly what your clients need. Free Discovery Agent + full toolkit from R850.",
};

const solutions = [
  {
    title: "Discovery Agent",
    description:
      "Try our guided discovery tool for free. Answer 5 questions and get a clear project route in under 3 minutes.",
    price: "Free",
    priceUsd: "",
    href: "/discovery",
    highlight: "Start Here",
  },
  {
    title: "Discovery Router Toolkit",
    description:
      "Turn vague ideas into specs so clear, your developers build exactly what your clients need—the first time.",
    price: "R850",
    priceUsd: "~$47",
    href: "/solutions/discovery-router",
    highlight: "Full Toolkit",
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Build What Your Clients Actually Needed
            </h1>
            <p className="text-lg text-slate-600">
              When specs are clear, developers build the right thing. Your clients
              get results. You get referrals.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {solutions.map((solution) => (
              <Link
                key={solution.href}
                href={solution.href}
                className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all"
              >
                {solution.highlight && (
                  <span className="inline-block bg-slate-900 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                    {solution.highlight}
                  </span>
                )}
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  {solution.title}
                </h2>
                <p className="text-slate-600 mb-6 min-h-[72px]">
                  {solution.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">
                      {solution.price}
                    </span>
                    <span className="text-sm text-slate-500 ml-2">
                      {solution.priceUsd}
                    </span>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
                    <ArrowRight weight="duotone" className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Why EntrSphere Section */}
          <div className="mt-24 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Why EntrSphere?
            </h2>
            <p className="text-slate-600 mb-6">
              Most consultants sell "AI Hype." We sell{" "}
              <strong>Process Engineering.</strong> We don't just "prompt" AI
              models. We build the rigorous frameworks (Discovery → Spec → Code →
              Test) that allow AI models to actually deliver value in a
              production environment.
            </p>
            <blockquote className="text-lg italic text-slate-700 border-l-4 border-slate-900 pl-4 text-left">
              "The prompt is not the product. The workflow is the product."
            </blockquote>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
