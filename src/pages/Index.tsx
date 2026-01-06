import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <SEO
        title="Protect Your Profits with AI-Native Development Frameworks"
        description="Stop losing R20,000-R50,000 per project on rework. EntrSphere provides AI-native frameworks that turn vague ideas into production-ready specs. For agencies, founders, and product teams."
        canonical="/"
      />
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Index;
