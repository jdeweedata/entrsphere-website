import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createBetaSignup, checkDuplicateEmail } from "@/services/betaSignupService";

interface BetaSignupFormProps {
  onFormSubmit: (eventName: string, eventCategory: string, eventLabel: string) => void;
}

const BetaSignupForm = ({ onFormSubmit }: BetaSignupFormProps) => {
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
      onFormSubmit('form_submit_error', 'Form Interaction', 'Beta Signup Invalid');
      return;
    }

    setIsSubmitting(true);
    onFormSubmit('form_submit_attempt', 'Form Interaction', 'Beta Signup Validated');
    
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
        onFormSubmit('beta_signup_complete', 'Conversion', 'Beta Signup Success');

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

  return (
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
              <Input 
                type="text" 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${nameError ? 'border-red-500' : 'border-slate-200 focus:border-slate-400'}`} 
                placeholder="e.g., Jane Doe" 
                required 
              />
              {nameError && <p className="text-xs text-red-500 mt-1">Name is required.</p>}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input 
                type="email" 
                id="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${emailError ? 'border-red-500' : 'border-slate-200 focus:border-slate-400'}`} 
                placeholder="you@company.com" 
                required 
              />
              {emailError && <p className="text-xs text-red-500 mt-1">Please enter a valid email.</p>}
            </div>

            {/* Company Input */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                Company Name (Optional)
              </label>
              <Input 
                type="text" 
                id="company" 
                value={company} 
                onChange={e => setCompany(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-400 transition-all duration-200" 
                placeholder="e.g., Your Startup Inc." 
              />
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
            {challenge === "other" && (
              <div>
                <label htmlFor="other_challenge" className="block text-sm font-medium text-slate-700 mb-2">
                  Please specify your challenge:
                </label>
                <Input 
                  type="text" 
                  id="other_challenge" 
                  value={otherChallenge} 
                  onChange={e => setOtherChallenge(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-400 transition-all duration-200" 
                  placeholder="Describe your challenge" 
                  required={challenge === "other"} 
                />
              </div>
            )}

            {/* Consent Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="consent" 
                checked={consent} 
                onCheckedChange={checked => setConsent(checked as boolean)} 
                className="mt-1" 
                required 
              />
              <label htmlFor="consent" className="text-sm text-slate-600 cursor-pointer">
                I consent to my data being processed per GDPR <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
            >
              {isSubmitting ? "Submitting..." : "Sign Up & Get Checklist"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BetaSignupForm;
