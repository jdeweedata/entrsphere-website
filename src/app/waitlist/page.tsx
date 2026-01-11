"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ValueCards, ObjectionCards } from "@/components/waitlist";

// Dynamic imports for Convex-dependent components (no SSR)
const WaitlistHero = dynamic(
  () => import("@/components/waitlist/WaitlistHero").then((mod) => mod.WaitlistHero),
  { ssr: false, loading: () => <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-slate-400">Loading...</div></div> }
);

const ScarcitySection = dynamic(
  () => import("@/components/waitlist/ScarcitySection").then((mod) => mod.ScarcitySection),
  { ssr: false }
);

const FinalCTA = dynamic(
  () => import("@/components/waitlist/FinalCTA").then((mod) => mod.FinalCTA),
  { ssr: false }
);

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white">
      <Header />
      <main>
        <WaitlistHero />
        <ValueCards />
        <ScarcitySection />
        <ObjectionCards />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
