import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import SocialProof from "@/components/SocialProof";
import { createBetaSignup, checkDuplicateEmail } from "@/services/betaSignupService";

const Index = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [challenge, setChallenge] = useState("");
  const [otherChallenge, setOtherChallenge] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [challengeError, setChallengeError] = useState(false);

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
  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(false);
    setEmailError(false);
    setChallengeError(false);
    let isValid = true;

    // Validation
    if (!name.trim()) {
      setNameError(true);
      isValid = false;
    }
    if (!email.trim() || !validateEmail(email)) {
      setEmailError(true);
      isValid = false;
    }
    if (!challenge) {
      setChallengeError(true);
      isValid = false;
    }
    if (challenge === "other" && !otherChallenge.trim()) {
      isValid = false;
    }
    if (!consent) {
      toast.error("Please consent to data processing to continue");
      return;
    }
    if (!isValid) {
      toast.error("Please correct the errors above");
      trackEvent('form_submit_error', 'Form Interaction', 'Beta Signup Invalid');
      return;
    }
    setIsSubmitting(true);
    trackEvent('form_submit_attempt', 'Form Interaction', 'Beta Signup Validated');
    try {
      // Check for duplicate email
      const isDuplicate = await checkDuplicateEmail(email);
      if (isDuplicate) {
        toast.error("This email is already registered for our beta program.");
        setIsSubmitting(false);
        return;
      }

      // Create beta signup
      const result = await createBetaSignup({
        name,
        email,
        company,
        challenge,
        otherChallenge: challenge === "other" ? otherChallenge : undefined,
        consent
      });

      if (result.success) {
        toast.success("Thank you for signing up! We will be in touch soon with your checklist.");
        
        // Track successful submission
        trackEvent('beta_signup_complete', 'Conversion', 'Beta Signup Success');

        // Reset form
        setName("");
        setEmail("");
        setCompany("");
        setChallenge("");
        setOtherChallenge("");
        setConsent(false);
      } else {
        toast.error("Something went wrong. Please try again.");
        console.error('Signup failed:', result.error);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChallengeChange = (value: string) => {
    setChallenge(value);
    if (value !== "other") {
      setOtherChallenge("");
    }
  };
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/4824a6ff-4ee4-49c4-a5e0-681407eaf295.png" alt="EntrSphere Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-slate-900">entrsphere</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Platform Overview</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Success Stories</a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
            </div>

            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-full font-medium" onClick={() => trackEvent('click_cta_nav', 'CTA', 'Book a Demo Nav')}>
              Book a Demo
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            Unlock Growth, Protect Margins, and Cut Costs—Without Hiring More or Wasting Budget
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Grow smarter—not harder. Let AI do the heavy lifting so you can scale profitably, control costs, and outpace competitors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-medium" onClick={() => trackEvent('click_cta_hero', 'CTA', 'Book a Demo Hero')}>
              Book a demo
            </Button>
            <Button variant="outline" className="px-8 py-3 rounded-full font-medium" onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}>
              Join Beta - Get Free Checklist
            </Button>
          </div>

          {/* Platform Visual */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 text-left">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="h-20 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600 font-bold">-40% Costs</span>
                    </div>
                    <div className="h-20 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 font-bold">+80% Speed</span>
                    </div>
                    <div className="h-20 bg-purple-100 rounded flex items-center justify-center">
                      <span className="text-purple-600 font-bold">24/7 Auto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
              🎁 Beta Access Available
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Automate with EntrSphere?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover how our AI-powered platform can transform your startup's efficiency and scalability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Streamline Workflows</h3>
              <p className="text-slate-600 leading-relaxed">Automate repetitive tasks and free up your team for strategic initiatives.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Reduce Costs</h3>
              <p className="text-slate-600 leading-relaxed">Optimize resource allocation and minimize operational expenses effectively.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Scale with Confidence</h3>
              <p className="text-slate-600 leading-relaxed">Grow your business without being hindered by manual process limitations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div id="testimonials">
        <Testimonials />
      </div>

      {/* Sign Up Form */}
      <section id="signup" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Join Our Exclusive Beta!</h2>
              <p className="text-lg text-slate-600">
                🎁 Sign up for our beta and get a <strong className="text-orange-500">free AI automation checklist</strong> for startups worldwide!
              </p>
              <div className="mt-4 text-sm text-orange-600 font-medium">
                ⏰ Limited spots available - Only 50 beta users remaining
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${nameError ? 'border-red-500' : 'border-slate-200 focus:border-slate-400'}`} placeholder="e.g., Jane Doe" required />
                {nameError && <p className="text-xs text-red-500 mt-1">Name is required.</p>}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${emailError ? 'border-red-500' : 'border-slate-200 focus:border-slate-400'}`} placeholder="you@company.com" required />
                {emailError && <p className="text-xs text-red-500 mt-1">Please enter a valid email.</p>}
              </div>

              {/* Company Input */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name (Optional)
                </label>
                <Input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-400 transition-all duration-200" placeholder="e.g., Your Startup Inc." />
              </div>

              {/* Challenge Dropdown */}
              <div>
                <label htmlFor="challenge" className="block text-sm font-medium text-slate-700 mb-2">
                  What's your biggest challenge? <span className="text-red-500">*</span>
                </label>
                <Select value={challenge} onValueChange={handleChallengeChange}>
                  <SelectTrigger className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${challengeError ? 'border-red-500' : 'border-slate-200 focus:border-slate-400'}`}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-lg rounded-lg">
                    <SelectItem value="manual_processes">Manual processes</SelectItem>
                    <SelectItem value="high_costs">High operational costs</SelectItem>
                    <SelectItem value="digital_transformation">Digital transformation</SelectItem>
                    <SelectItem value="scaling_operations">Scaling operations</SelectItem>
                    <SelectItem value="other">Other (please specify)</SelectItem>
                  </SelectContent>
                </Select>
                {challengeError && <p className="text-xs text-red-500 mt-1">Please select your biggest challenge.</p>}
              </div>

              {/* Other Challenge Text Input */}
              {challenge === "other" && <div>
                  <label htmlFor="other_challenge" className="block text-sm font-medium text-slate-700 mb-2">
                    Please specify your challenge:
                  </label>
                  <Input type="text" id="other_challenge" value={otherChallenge} onChange={e => setOtherChallenge(e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-400 transition-all duration-200" placeholder="Describe your challenge" required={challenge === "other"} />
                </div>}

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-3">
                <Checkbox id="consent" checked={consent} onCheckedChange={checked => setConsent(checked as boolean)} className="mt-1" required />
                <label htmlFor="consent" className="text-sm text-slate-600 cursor-pointer">
                  I consent to my data being processed per GDPR <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300">
                {isSubmitting ? "Submitting..." : "Sign Up & Get Checklist"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div id="faq">
        <FAQ />
      </div>

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
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-medium" onClick={() => {
            trackEvent('click_feedback_cta', 'CTA', 'Feedback Button');
            window.location.href = "mailto:admin@entrsphere.com?subject=Feedback%20on%20AI%20Automation";
          }}>
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
    </div>;
};

export default Index;
