"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly do I get?",
    answer:
      "A prioritized list of what's broken in your online presence and what to fix first — ranked by business impact. Depending on your tier, this includes your website, email flows, and one key business process. Delivered as a clear action report, not a 50-page strategy deck.",
  },
  {
    question: "How is this different from an agency?",
    answer:
      "Agencies sell retainers and monthly reports. We sell clarity. You pay once, get a prioritized punch list in 48 hours, and decide what to do next. No lock-in, no ongoing fees, no PowerPoints full of vanity metrics.",
  },
  {
    question: "How long does it take?",
    answer:
      "48 hours from when you submit your intake form. That's it.",
  },
  {
    question: "What if I'm not satisfied?",
    answer:
      "If your audit doesn't surface at least 3 actionable improvements you didn't know about, full refund. No forms, no arguing.",
  },
  {
    question: "Do I need to prepare anything?",
    answer:
      "Just fill out a 2-minute form after payment — your website URL and your biggest challenge. We handle everything else.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Yes. Email us and we'll credit your current payment toward a higher tier.",
  },
  {
    question: "I've been burned before. Why should I trust this?",
    answer:
      "Fair. That's why there's no retainer, no long-term commitment, and a money-back guarantee. You pay once, see the work, and decide if it was worth it. The audit speaks for itself.",
  },
  {
    question: "What if I need help implementing the fixes?",
    answer:
      "Most quick wins are DIY — we write the report so you can act on it yourself. For bigger changes, we offer implementation support on a project basis. No retainer. Just tell us what you need help with after you've seen the audit.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-24 border-t border-border/50">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-foreground italic text-center mb-12">
          Common Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-foreground hover:text-primary transition-colors text-sm font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
