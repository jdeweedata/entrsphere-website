"use client";

const objections = [
  {
    question: "Can't I just ask ChatGPT to write my spec?",
    answer:
      "ChatGPT doesn't know what actually ships. Our framework is trained on real project outcomes—success, failure, delay patterns. It tells you what works, not what sounds good.",
  },
  {
    question: "I already have developers. Why do I need this?",
    answer:
      "71% of project failures come from requirements, not code. Your devs build what you spec. We make sure you spec the right thing.",
    source: "Research on software project failures",
  },
  {
    question: "Why is access limited?",
    answer:
      "Each cohort contributes outcome data back to the benchmarks. We cap cohorts to ensure data quality and give early users lifetime access to improving insights.",
  },
];

export function ObjectionCards() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
          &ldquo;Why not just use ChatGPT?&rdquo;
        </h2>
        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          Fair question. Here&apos;s what makes this different.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {objections.map((objection, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-6 border border-slate-100"
            >
              <p className="text-slate-900 font-semibold mb-3">
                Q: {objection.question}
              </p>
              <p className="text-slate-600 text-sm">
                <span className="font-medium text-slate-700">A:</span>{" "}
                {objection.answer}
              </p>
              {objection.source && (
                <p className="text-xs text-slate-400 italic mt-3">
                  {objection.source}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
