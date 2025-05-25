import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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
      const challengeText = challenge === "other" ? otherChallenge : challenge;
      const subject = encodeURIComponent("Beta Registration - EntrSphere AI Automation");
      const body = encodeURIComponent(`
Name: ${name}
Email: ${email}
Company: ${company || 'Not specified'}
Biggest Challenge: ${challengeText}

User has consented to data processing per GDPR.
      `);
      const mailtoLink = `mailto:admin@entrsphere.com?subject=${subject}&body=${body}`;
      
      // Simulate processing time
      setTimeout(() => {
        window.location.href = mailtoLink;
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
        setIsSubmitting(false);
      }, 1500);

    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChallengeChange = (value: string) => {
    setChallenge(value);
    if (value !== "other") {
      setOtherChallenge("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header id="home" className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
        <div className="container mx-auto px-6 py-20 md:py-32 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/4824a6ff-4ee4-49c4-a5e0-681407eaf295.png" 
              alt="EntrSphere Logo" 
              className="w-24 h-24 object-contain" 
            />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            EntrSphere: Boost Your Startup with AI Automation
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join Our Beta to Automate Your Business – Save Time and Costs Today!
          </p>
          <p className="text-lg md:text-xl italic mb-12 max-w-2xl mx-auto">
            "Say goodbye to manual processes and hello to seamless AI-driven growth that works anywhere, anytime."
          </p>
          <a 
            href="#signup"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg shadow-lg inline-block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            onClick={() => trackEvent('click_cta_hero', 'CTA', 'Learn More Hero')}
          >
            Sign Up for Beta Access
          </a>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* Features Section */}
        <section id="features" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-purple-600">Why Automate with EntrSphere?</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover how our AI-powered platform can transform your startup's efficiency and scalability.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="text-purple-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Streamline Workflows</h3>
              <p className="text-gray-600">Automate repetitive tasks and free up your team for strategic initiatives.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="text-teal-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Reduce Costs</h3>
              <p className="text-gray-600">Optimize resource allocation and minimize operational expenses effectively.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="text-orange-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Scale with Confidence</h3>
              <p className="text-gray-600">Grow your business without being hindered by manual process limitations.</p>
            </div>
          </div>
        </section>

        {/* Platform Preview Section */}
        <section id="platform-preview" className="py-16 bg-gray-50 rounded-xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-purple-600">See EntrSphere in Action</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Visualize how our intuitive platform integrates AI automation seamlessly into your startup.
          </p>
          <div className="flex justify-center items-center">
            <img 
              src="https://placehold.co/800x450/8B5CF6/FFFFFF?text=EntrSphere+Platform+Mockup&font=inter"
              alt="EntrSphere Platform Mockup"
              className="rounded-lg shadow-xl border-4 border-white w-full max-w-3xl h-auto"
              loading="lazy"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Friendly, modern illustrations will showcase AI automation concepts here.
          </p>
        </section>

        {/* Sign Up Form */}
        <section id="signup" className="py-16">
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-purple-600 mb-3">Join Our Exclusive Beta!</h2>
              <p className="text-lg text-gray-700">
                🎁 Sign up for our beta and get a <strong className="text-orange-500">free AI automation checklist</strong> for startups worldwide!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="text" 
                  id="name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 text-lg rounded-lg border-2 transition-all duration-200 ${
                    nameError ? 'border-red-500' : 'border-blue-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200'
                  }`}
                  placeholder="e.g., Jane Doe"
                  required 
                />
                {nameError && <p className="text-xs text-red-500 mt-1">Name is required.</p>}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="email" 
                  id="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 text-lg rounded-lg border-2 transition-all duration-200 ${
                    emailError ? 'border-red-500' : 'border-blue-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200'
                  }`}
                  placeholder="you@company.com"
                  required 
                />
                {emailError && <p className="text-xs text-red-500 mt-1">Please enter a valid email.</p>}
              </div>

              {/* Company Input */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name (Optional)
                </label>
                <Input 
                  type="text" 
                  id="company"
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 text-lg rounded-lg border-2 border-blue-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200"
                  placeholder="e.g., Your Startup Inc."
                />
              </div>

              {/* Challenge Dropdown */}
              <div>
                <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-1">
                  What's your biggest challenge? <span className="text-red-500">*</span>
                </label>
                <Select value={challenge} onValueChange={handleChallengeChange}>
                  <SelectTrigger className={`w-full px-4 py-3 text-lg rounded-lg border-2 transition-all duration-200 ${
                    challengeError ? 'border-red-500' : 'border-blue-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200'
                  }`}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-lg rounded-lg z-50">
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
              {challenge === "other" && (
                <div>
                  <label htmlFor="other_challenge" className="block text-sm font-medium text-gray-700 mb-1">
                    Please specify your challenge:
                  </label>
                  <Input 
                    type="text" 
                    id="other_challenge"
                    value={otherChallenge} 
                    onChange={(e) => setOtherChallenge(e.target.value)}
                    className="w-full px-4 py-3 text-lg rounded-lg border-2 border-blue-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200"
                    placeholder="Describe your challenge"
                    required={challenge === "other"}
                  />
                </div>
              )}

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-3 text-left">
                <Checkbox 
                  id="consent" 
                  checked={consent} 
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  className="mt-1 border-2 border-blue-500" 
                  required 
                />
                <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer text-slate-600">
                  I consent to my data being processed per GDPR <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full font-bold py-4 px-6 rounded-lg text-lg text-white transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                {isSubmitting ? "Submitting..." : "Sign Up & Get Checklist"}
              </Button>
            </form>
          </div>
        </section>

        {/* Trust Section */}
        <section id="trust" className="py-12 text-center">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-700">Committed to Your Privacy & Security</h2>
          <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 text-green-700 font-semibold py-3 px-6 rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              GDPR & Privacy Compliant ✅
            </div>
          </div>
        </section>

        {/* Feedback CTA */}
        <section id="feedback" className="py-16 bg-purple-50 rounded-xl">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">Help Us Improve!</h2>
            <p className="text-lg text-gray-700 mb-8">
              We value your input. Share your thoughts on AI automation for your startup and help us build the best solution for you.
            </p>
            <a 
              href="mailto:admin@entrsphere.com?subject=Feedback%20on%20AI%20Automation"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-md shadow-md hover:shadow-lg transition duration-300 inline-block"
              onClick={() => trackEvent('click_feedback_cta', 'CTA', 'Feedback Button')}
            >
              Share Your Thoughts
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-6 text-center">
          <nav className="mb-6 space-x-4 sm:space-x-6">
            <a href="#about" className="hover:text-purple-400 transition-colors">About Us</a>
            <a href="#privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#contact" className="hover:text-purple-400 transition-colors">Contact Us</a>
          </nav>
          <p>&copy; 2025 EntrSphere. All Rights Reserved.</p>
          <p className="text-sm mt-2">Built for a global startup community.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
