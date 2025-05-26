
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import SocialProof from "@/components/SocialProof";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import SolutionsSection from "@/components/SolutionsSection";
import BetaSignupForm from "@/components/BetaSignupForm";
import Footer from "@/components/Footer";

const Index = () => {
  // Analytics tracking function
  const trackEvent = (eventName: string, eventCategory: string, eventLabel: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        'event_category': eventCategory,
        'event_label': eventLabel
      });
    }
    console.log(`Tracked Event: ${eventName}, Category: ${eventCategory}, Label: ${eventLabel}`);
  };

  const handleGetAudit = () => {
    trackEvent('click_cta_primary', 'CTA', 'Platform Strategy Session');
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFeedbackClick = () => {
    trackEvent('click_feedback_cta', 'CTA', 'Feedback Button');
    window.location.href = "mailto:admin@entrsphere.com?subject=Feedback%20on%20Platform%20Solutions";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onGetAudit={handleGetAudit} />
      <HeroSection onGetAudit={handleGetAudit} />
      <SocialProof />
      <ProblemsSection />
      <SolutionsSection />
      <Testimonials />
      <BetaSignupForm onFormSubmit={trackEvent} />
      
      <div id="faq">
        <FAQ />
      </div>
      
      <Footer onFeedbackClick={handleFeedbackClick} />
    </div>
  );
};

export default Index;
