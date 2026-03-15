const testimonials = [
  {
    quote:
      "I was skeptical — I'd burned R10K on an agency that gave me nothing but dashboards. This was the opposite. Five clear fixes, ranked by impact. I implemented the first one that afternoon.",
    name: "Placeholder Name",
    role: "Electrical Contractor",
    location: "Johannesburg",
    initials: "JM",
  },
  {
    quote:
      "Knew my website was losing me leads but had no idea how bad it was. The audit showed me exactly where people were dropping off. Fixed the contact form issue and got 3 enquiries in the first week.",
    name: "Placeholder Name",
    role: "HR Consulting Firm",
    location: "Cape Town",
    initials: "TN",
  },
  {
    quote:
      "Best R6,000 I've spent on my business this year. No waffle, no 50-page report. Just 'do this, then this, then this.' The video walkthrough meant I actually understood WHY.",
    name: "Placeholder Name",
    role: "B2B Services",
    location: "Durban",
    initials: "SK",
  },
];

export default function SocialProof() {
  return (
    <section className="py-24 border-t border-border/50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-foreground italic text-center mb-4">
          Business Owners Who Stopped Guessing
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          Join 50+ SA business owners who got clarity on what to fix first.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.initials}
              className="rounded-xl border border-border bg-card/50 p-6"
            >
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                  {t.initials}
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {t.name}
                  </p>
                  <p className="text-muted-foreground/70 text-xs">
                    {t.role}, {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
