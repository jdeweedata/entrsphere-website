"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown } from "@phosphor-icons/react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16">
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-primary font-medium tracking-wide uppercase text-sm mb-6">
          48-Hour Business Audit
        </p>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-8 italic">
          Your Online Presence Is Costing You Customers.{" "}
          <span className="text-primary">I'll Show You Exactly Where.</span>
        </h1>

        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          In 48 hours, you'll have a prioritized list of exactly what's broken
          and what to fix first — for a fixed fee. No retainer. No 50-page
          strategy deck. Just the 5 things that will actually move the needle.
        </p>

        <p className="text-muted-foreground/70 text-sm mb-10">
          For business owners who are done guessing and ready to act.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() =>
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 font-medium"
          >
            See What's Included
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <p className="text-muted-foreground/50 text-xs mt-6">
          Takes 3 minutes to get started. Report delivered in 48 hours.
        </p>
      </div>
    </section>
  );
}
