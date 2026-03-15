import {
  CurrencyCircleDollar,
  ClipboardText,
  ChartLineUp,
} from "@phosphor-icons/react/dist/ssr";

const steps = [
  {
    number: "01",
    icon: CurrencyCircleDollar,
    title: "Choose Your Audit",
    description:
      "Pick the tier that fits your needs. Pay once, no subscription.",
  },
  {
    number: "02",
    icon: ClipboardText,
    title: "Tell Us About Your Business",
    description:
      "Fill out a quick form with your website URL and biggest challenge.",
  },
  {
    number: "03",
    icon: ChartLineUp,
    title: "Get Your Report in 48 Hours",
    description:
      "A prioritized list of exactly what to fix, in what order, and why.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 border-t border-border/50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-foreground italic text-center mb-4">
          How It Works
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          Three steps. No calls, no meetings, no back-and-forth.
        </p>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-border mb-6">
                <step.icon className="h-6 w-6 text-primary" weight="light" />
              </div>
              <p className="text-primary/60 text-xs font-mono tracking-widest mb-2">
                STEP {step.number}
              </p>
              <h3 className="text-foreground font-medium text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
