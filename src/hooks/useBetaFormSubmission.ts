
import { useState } from 'react';
import { toast } from 'sonner';
import { createBetaSignup, checkDuplicateEmail } from '@/services/betaSignupService';

interface FormData {
  name: string;
  email: string;
  company: string;
  challenge: string;
  otherChallenge: string;
  consent: boolean;
}

interface UseBetaFormSubmissionProps {
  onFormSubmit: (eventName: string, eventCategory: string, eventLabel: string) => void;
  validateForm: (name: string, email: string, challenge: string, otherChallenge: string) => boolean;
  resetErrors: () => void;
}

export const useBetaFormSubmission = ({ onFormSubmit, validateForm, resetErrors }: UseBetaFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData, resetForm: () => void) => {
    const { name, email, company, challenge, otherChallenge, consent } = formData;

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
        resetForm();
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

  return {
    isSubmitting,
    handleSubmit,
  };
};
