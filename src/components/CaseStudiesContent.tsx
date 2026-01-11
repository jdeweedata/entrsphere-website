"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendUp, Clock, Lightning } from "@phosphor-icons/react";

type Category = "all" | "solopreneur" | "agency" | "startup";

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "solopreneur", label: "Solopreneurs" },
  { value: "agency", label: "Agencies" },
  { value: "startup", label: "Startups" },
];

const caseStudies = [
  {
    id: "saas-founder-mvp",
    category: "solopreneur" as Category,
    title: "From Idea to Paying Customers in 3 Weeks",
    client: "SaaS Founder",
    industry: "Productivity Software",
    challenge:
      "Had a validated idea but spent months in 'requirements limbo'—unable to articulate the product clearly enough for developers to build it.",
    solution: "Discovery Router Toolkit",
    results: [
      { metric: "3 weeks", label: "Idea to MVP" },
      { metric: "R0", label: "Wasted dev spend" },
      { metric: "12", label: "Paying customers at launch" },
    ],
    quote:
      "I stopped trying to explain my product in meetings and started using the Discovery Router. My first spec was so clear that the developer said 'this is the best brief I've ever received.'",
    leverageType: "Code",
    leverageIcon: Lightning,
  },
  {
    id: "freelance-developer-agency",
    category: "solopreneur" as Category,
    title: "Freelancer to Agency Owner Without Hiring",
    client: "Freelance Developer",
    industry: "Web Development",
    challenge:
      "Burned out from trading hours for money. Wanted to scale income without hiring employees or working more hours.",
    solution: "Product Requirement Framework + AI Pipeline",
    results: [
      { metric: "3x", label: "Revenue increase" },
      { metric: "50%", label: "Less client meetings" },
      { metric: "4", label: "Concurrent projects" },
    ],
    quote:
      "The framework let me productize my discovery process. Now I charge R8,500 for a 'Spec Sprint' that takes me 2 hours with AI assistance. That's permissionless leverage.",
    leverageType: "Systems",
    leverageIcon: TrendUp,
  },
  {
    id: "content-creator-saas",
    category: "solopreneur" as Category,
    title: "Newsletter Writer Launches Micro-SaaS",
    client: "Content Creator",
    industry: "Creator Economy",
    challenge:
      "Had 15,000 newsletter subscribers but income was capped by sponsorship rates. Wanted to build a software product but had zero coding experience.",
    solution: "Discovery Router Toolkit + Consulting",
    results: [
      { metric: "R45K", label: "MRR in 6 months" },
      { metric: "1", label: "No-code tool built" },
      { metric: "340", label: "Paying subscribers" },
    ],
    quote:
      "I used the Non-Technical Discovery prompt to define exactly what I wanted. Then I handed the SPEC.json to a Claude Code agent. My audience became my first customers.",
    leverageType: "Media + Code",
    leverageIcon: Lightning,
  },
  {
    id: "boutique-agency-scale",
    category: "agency" as Category,
    title: "5-Person Agency Delivers Like a 20-Person Team",
    client: "Digital Agency",
    industry: "Marketing & Design",
    challenge:
      "Losing enterprise deals to larger agencies. Couldn't compete on team size but needed to deliver the same output quality and speed.",
    solution: "Custom AI Development Pipeline",
    results: [
      { metric: "4x", label: "Project throughput" },
      { metric: "R2.1M", label: "Annual revenue" },
      { metric: "0", label: "New hires needed" },
    ],
    quote:
      "Our AI pipeline handles the grunt work—research, first drafts, QA. Our humans do the creative strategy and client relationships. We're a 5-person agency with 20-person output.",
    leverageType: "Code + Systems",
    leverageIcon: TrendUp,
  },
  {
    id: "dev-shop-standardization",
    category: "agency" as Category,
    title: "Dev Shop Eliminates Scope Creep Forever",
    client: "Software Development Shop",
    industry: "Custom Software",
    challenge:
      "Every project went over budget due to scope creep. Clients kept changing requirements mid-build, destroying margins.",
    solution: "Discovery Router Toolkit + PRD Framework",
    results: [
      { metric: "0", label: "Scope creep incidents" },
      { metric: "35%", label: "Higher margins" },
      { metric: "2 days", label: "Discovery to contract" },
    ],
    quote:
      "The Strategic Ambiguity prompt was a game-changer. We now surface political blockers in the first meeting, not month three. Our contracts are bulletproof.",
    leverageType: "Systems",
    leverageIcon: Clock,
  },
  {
    id: "ai-startup-mvp",
    category: "startup" as Category,
    title: "Pre-Seed Startup Ships MVP Before Raising",
    client: "AI Startup Founders",
    industry: "FinTech",
    challenge:
      "Two non-technical founders with a validated idea but no CTO. Couldn't afford to hire developers before raising, couldn't raise without a product.",
    solution: "Discovery Router Toolkit + Integration Workshop",
    results: [
      { metric: "R850", label: "Total spec cost" },
      { metric: "6 weeks", label: "To working MVP" },
      { metric: "R3.2M", label: "Pre-seed raised" },
    ],
    quote:
      "We used the Integration Discovery workshop to map our FinTech API dependencies. The output was so detailed that we hired a junior dev and an AI agent to build it. Saved us R500K in senior dev costs.",
    leverageType: "Code",
    leverageIcon: Lightning,
  },
  {
    id: "bootstrap-founder-pivot",
    category: "startup" as Category,
    title: "Bootstrapped Founder Pivots in 2 Weeks, Not 2 Months",
    client: "Bootstrapped SaaS Founder",
    industry: "HR Tech",
    challenge:
      "Realized product-market fit was off after 8 months. Needed to pivot quickly but couldn't afford another long development cycle.",
    solution: "Product Requirement Framework",
    results: [
      { metric: "2 weeks", label: "Pivot timeline" },
      { metric: "R12K", label: "Total pivot cost" },
      { metric: "23%", label: "Conversion rate increase" },
    ],
    quote:
      "The PRD templates forced me to define success metrics before coding. I caught three fatal assumptions in my pivot idea during the spec phase—before wasting money building them.",
    leverageType: "Systems",
    leverageIcon: Clock,
  },
];

export default function CaseStudiesContent() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredStudies =
    activeCategory === "all"
      ? caseStudies
      : caseStudies.filter((study) => study.category === activeCategory);

  return (
    <div className="container mx-auto px-6">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="inline-block bg-slate-100 text-slate-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Permissionless Leverage in Action
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
          Small Teams. Massive Output.
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Real stories of solopreneurs, agencies, and startups using
          AI-native frameworks to build leverage that doesn't require
          permission—code, media, and systems that scale without trading
          more time.
        </p>

        {/* Naval Quote */}
        <blockquote className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-left max-w-2xl mx-auto">
          <p className="text-slate-700 italic mb-3">
            "Fortunes require leverage. Labor and capital require permission.
            Code and media don't. They're permissionless leverage."
          </p>
          <cite className="text-slate-500 text-sm not-italic">
            — Naval Ravikant
          </cite>
        </blockquote>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.value
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Case Studies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredStudies.map((study) => {
          const LeverageIcon = study.leverageIcon;
          return (
            <article
              key={study.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all group flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {study.client}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                  <LeverageIcon weight="duotone" className="h-3 w-3" />
                  {study.leverageType}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                {study.title}
              </h2>

              {/* Industry */}
              <p className="text-sm text-slate-500 mb-4">{study.industry}</p>

              {/* Challenge */}
              <p className="text-sm text-slate-600 mb-4 flex-grow">
                {study.challenge}
              </p>

              {/* Solution Badge */}
              <div className="mb-4">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                  {study.solution}
                </span>
              </div>

              {/* Results */}
              <div className="grid grid-cols-3 gap-2 mb-4 py-4 border-t border-slate-100">
                {study.results.map((result) => (
                  <div key={result.label} className="text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {result.metric}
                    </p>
                    <p className="text-xs text-slate-500">{result.label}</p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-slate-600 italic border-l-2 border-slate-200 pl-3">
                "{study.quote.substring(0, 120)}..."
              </blockquote>
            </article>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-20 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Ready to Build Your Leverage?
        </h2>
        <p className="text-slate-600 mb-8">
          Stop trading time for money. Start building systems, code, and
          media that work while you sleep.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/solutions"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Explore Solutions
            <ArrowRight weight="duotone" className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-lg font-medium border border-slate-200 transition-colors"
          >
            Book a Strategy Call
          </Link>
        </div>
      </div>
    </div>
  );
}
