export interface PricingTier {
  id: string;
  name: string;
  zarPrice: number; // in cents
  usdPrice: number; // in whole dollars
  description: string;
  features: string[];
  popular?: boolean;
  itemName: string;
  itemDescription: string;
}

export const TIERS: PricingTier[] = [
  {
    id: "quick-scan",
    name: "Quick Scan",
    zarPrice: 250000,
    usdPrice: 140,
    description: "Get a clear picture of what needs fixing first.",
    features: [
      "Full website review",
      "5 prioritized fixes ranked by impact",
      "Delivered via email within 48 hours",
    ],
    itemName: "EntrSphere — Quick Scan",
    itemDescription: "Website review with 5 prioritized fixes",
  },
  {
    id: "deep-dive",
    name: "Deep Dive",
    zarPrice: 600000,
    usdPrice: 335,
    description: "Website plus the systems behind it.",
    popular: true,
    features: [
      "Everything in Quick Scan",
      "Email flows and automation review",
      "48-hour action report (PDF)",
      "Prioritized recommendations by category",
    ],
    itemName: "EntrSphere — Deep Dive",
    itemDescription:
      "Website + email flows review with 48h action report",
  },
  {
    id: "full-audit",
    name: "Full Audit",
    zarPrice: 750000,
    usdPrice: 415,
    description: "The complete picture, with a walkthrough.",
    features: [
      "Everything in Deep Dive",
      "1 key business process review",
      "30-minute video walkthrough",
      "Direct Q&A on findings",
    ],
    itemName: "EntrSphere — Full Audit",
    itemDescription:
      "Complete audit with video walkthrough and Q&A",
  },
];

export function formatZAR(cents: number): string {
  return `R${(cents / 100).toLocaleString("en-ZA")}`;
}

export function formatUSD(dollars: number): string {
  return `$${dollars}`;
}
