
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBetaSignupValidation } from "@/hooks/useBetaSignupValidation";
import { useBetaFormSubmission } from "@/hooks/useBetaFormSubmission";
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

  const { errors, validateForm, resetErrors } = useBetaSignupValidation();
  
  const resetForm = () => {
    setName("");
    setEmail("");
    setCompany("");
    setChallenge("");
    setOtherChallenge("");
    setConsent(false);
  };

  const { isSubmitting, handleSubmit } = useBetaFormSubmission({
    onFormSubmit,
    validateForm,
    resetErrors,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit({
      name,
      email,
      company,
      challenge,
      otherChallenge,
      consent,
    }, resetForm);
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

          <form onSubmit={onSubmit} className="space-y-6">
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
