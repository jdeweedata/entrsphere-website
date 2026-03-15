import AuditHeader from "@/components/audit/audit-header";
import HeroSection from "@/components/audit/hero-section";
import HowItWorks from "@/components/audit/how-it-works";
import PricingSection from "@/components/audit/pricing-section";
import SocialProof from "@/components/audit/social-proof";
import AfterAudit from "@/components/audit/after-audit";
import FAQSection from "@/components/audit/faq-section";
import AuditFooter from "@/components/audit/audit-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AuditHeader />
      <HeroSection />
      <HowItWorks />
      <PricingSection />
      <SocialProof />
      <AfterAudit />
      <FAQSection />
      <AuditFooter />
    </div>
  );
}
