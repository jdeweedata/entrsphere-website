
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createBetaSignup, checkDuplicateEmail } from "@/services/betaSignupService";
import { useBetaSignupValidation } from "@/hooks/useBetaSignupValidation";
import BetaFormHeader from "@/components/forms/BetaFormHeader";
import FormField from "@/components/forms/FormField";
import ChallengeSelect from "@/components/forms/ChallengeSelect";
import ConsentCheckbox from "@/components/forms/ConsentCheckbox";

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

  const { errors, validateForm, resetErrors } = useBetaSignupValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    resetErrors();
    const isValid = validateForm(name, email, challenge, otherChallenge);

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
      const isDuplicate = await checkDuplicateEmail(email);
      if (isDuplicate) {
        toast.error("This email is already registered for our beta program.");
        setIsSubmitting(false);
        return;
      }

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
          <BetaFormHeader />

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="name"
              label="Full Name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Jane Doe"
              required
              error={errors.nameError}
              errorMessage="Name is required."
            />

            <FormField
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              error={errors.emailError}
              errorMessage="Please enter a valid email."
            />

            <FormField
              id="company"
              label="Company Name (Optional)"
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g., Your Startup Inc."
            />

            <ChallengeSelect
              challenge={challenge}
              otherChallenge={otherChallenge}
              onChallengeChange={handleChallengeChange}
              onOtherChallengeChange={e => setOtherChallenge(e.target.value)}
              error={errors.challengeError}
            />

            <ConsentCheckbox
              consent={consent}
              onConsentChange={setConsent}
            />

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
