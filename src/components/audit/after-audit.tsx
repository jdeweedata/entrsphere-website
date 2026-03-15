import {
  Wrench,
  Compass,
  Handshake,
} from "@phosphor-icons/react/dist/ssr";

const paths = [
  {
    icon: Wrench,
    title: "DIY",
    description:
      "Take the report and run with it. Most quick wins take under an hour.",
  },
  {
    icon: Compass,
    title: "Guided",
    description:
      "We walk you through implementation in a follow-up call. Included in Full Audit tier.",
  },
  {
    icon: Handshake,
    title: "Done for You",
    description:
      "We handle the fixes. Email us after your audit to discuss scope and pricing.",
  },
];

export default function AfterAudit() {
  return (
    <section className="py-24 border-t border-border/50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-foreground italic text-center mb-4">
          What Happens After Your Audit?
        </h2>
        <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
          Your audit report is yours. Use it however you want — implement it
          yourself, hand it to your web developer, or use it to hold your agency
          accountable.
        </p>
        <p className="text-muted-foreground/70 text-sm text-center mb-14 max-w-xl mx-auto">
          Need help implementing? Most of our clients can handle the quick wins
          themselves. For the bigger changes, we offer hands-on implementation
          support — no retainer required, just project-based help at your pace.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((path) => (
            <div
              key={path.title}
              className="text-center p-6 rounded-lg border border-border/50"
            >
              <path.icon
                className="h-6 w-6 text-primary mx-auto mb-4"
                weight="light"
              />
              <h3 className="text-foreground font-medium mb-2">
                {path.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {path.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
