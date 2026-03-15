"use client";

import { useState } from "react";
import { TIERS, formatZAR, formatUSD } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check } from "@phosphor-icons/react";
import PayFastButton from "@/components/payments/PayFastButton";

type Currency = "zar" | "usd";

export default function PricingSection() {
  const [currency, setCurrency] = useState<Currency>("zar");
  const [email, setEmail] = useState("");

  return (
    <section id="pricing" className="py-24 border-t border-border/50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-foreground italic text-center mb-4">
          Choose Your Audit
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
          Fixed fee. No retainer. No surprises. Report in your inbox within 48
          hours.
        </p>

        {/* Currency Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full border border-border p-1 bg-secondary/50">
            <button
              onClick={() => setCurrency("zar")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currency === "zar"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ZAR
            </button>
            <button
              onClick={() => setCurrency("usd")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currency === "usd"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              USD
            </button>
          </div>
        </div>

        {/* Email Input */}
        <div className="max-w-sm mx-auto mb-10">
          <label
            htmlFor="audit-email"
            className="block text-sm text-muted-foreground mb-2 text-center"
          >
            Your email to get started
          </label>
          <Input
            id="audit-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center bg-secondary/50 border-border"
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const displayPrice =
              currency === "zar"
                ? formatZAR(tier.zarPrice)
                : formatUSD(tier.usdPrice);

            return (
              <div
                key={tier.id}
                className={`relative rounded-xl border p-8 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 ${
                  tier.popular
                    ? "border-primary/50 bg-card"
                    : "border-border bg-card/50"
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}

                <h3 className="text-foreground font-medium text-lg mb-1">
                  {tier.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {tier.description}
                </p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    {displayPrice}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">
                    once
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check
                        className="h-4 w-4 text-primary mt-0.5 shrink-0"
                        weight="bold"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <PayFastButton
                  customer={{ email }}
                  payment={{
                    amount: tier.zarPrice,
                    itemName: tier.itemName,
                    itemDescription: tier.itemDescription,
                    product: tier.id,
                  }}
                  className={`w-full py-5 font-medium ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Get My Audit — {displayPrice}
                </PayFastButton>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div className="text-center mt-8 space-y-2">
          {currency === "usd" && (
            <p className="text-muted-foreground/60 text-xs">
              Payment processed in ZAR via PayFast
            </p>
          )}
          <p className="text-muted-foreground text-sm">
            Not sure which tier? Start with the Quick Scan. You can always
            upgrade later — we'll credit your payment.
          </p>
          <p className="text-primary/70 text-xs font-medium">
            If your audit doesn't surface at least 3 actionable fixes, you pay
            nothing.
          </p>
        </div>
      </div>
    </section>
  );
}
