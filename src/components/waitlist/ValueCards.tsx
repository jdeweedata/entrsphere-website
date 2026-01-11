"use client";

import { Target, Lightning, ChartBar } from "@phosphor-icons/react";

const values = [
  {
    icon: Target,
    title: "Your Project Risk Score",
    description:
      "Projects with clear requirements are 97% more likely to succeed. Know your success probability before spending R1 on development.",
    source: "May 2024 study of 600 software engineers",
  },
  {
    icon: Lightning,
    title: "Failure Pattern Detection",
    description:
      "Our framework detects 4 risk patterns behind 71% of project failures. Find out which ones apply to you—and how to fix them.",
    source: "Industry research on software project failures",
  },
  {
    icon: ChartBar,
    title: "Industry Benchmarks",
    description:
      "Only 31% of projects succeed. 45% of features are never used. See where yours stands before you build the wrong thing.",
    source: "Standish Group CHAOS Report",
  },
];

export function ValueCards() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
          Why wait for access?
        </h2>
        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          Get insights that generic AI tools can&apos;t provide—backed by real
          project outcome data.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-blue-600" weight="duotone" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {value.title}
              </h3>
              <p className="text-slate-600 text-sm mb-3">{value.description}</p>
              <p className="text-xs text-slate-400 italic">{value.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
