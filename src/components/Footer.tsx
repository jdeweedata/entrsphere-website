
import { Button } from "@/components/ui/button";

interface FooterProps {
  onFeedbackClick: () => void;
}

const Footer = ({ onFeedbackClick }: FooterProps) => {
  return (
    <>
      {/* Trust Section */}
      <section id="trust" className="py-12 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Committed to Your Privacy & Security</h2>
          <div className="inline-flex items-center bg-green-50 border border-green-200 text-green-700 font-medium py-3 px-6 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            GDPR & Privacy Compliant ✅
          </div>
        </div>
      </section>

      {/* Feedback CTA */}
      <section id="feedback" className="py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Help Us Improve!</h2>
            <p className="text-lg text-slate-600 mb-8">
              We value your input. Share your thoughts on AI automation for your startup and help us build the best solution for you.
            </p>
            <Button 
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-medium" 
              onClick={onFeedbackClick}
            >
              Share Your Thoughts
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-6 text-center">
          <nav className="mb-6 space-x-6">
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
          </nav>
          <p className="text-slate-400">&copy; 2025 EntrSphere. All Rights Reserved.</p>
          <p className="text-sm text-slate-500 mt-2">Built for a global startup community.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
