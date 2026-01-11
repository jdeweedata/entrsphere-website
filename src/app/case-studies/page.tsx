import type { Metadata } from "next";
import CaseStudiesContent from "@/components/CaseStudiesContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Case Studies - Small Teams, Massive Output with AI-Native Frameworks",
  description:
    "Real stories of solopreneurs, agencies, and startups using AI-native frameworks to build permissionless leverage. See how they scaled without hiring.",
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />
      <main className="py-16">
        <CaseStudiesContent />
      </main>
      <Footer />
    </div>
  );
}
