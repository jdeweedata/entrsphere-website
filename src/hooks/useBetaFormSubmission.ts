import { useState } from 'react';
import { toast } from 'sonner';
import { usePostHog } from 'posthog-js/react';
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
  validateForm: (name: string, email: string, challenge: string, otherChallenge: string) => boolean;
  resetErrors: () => void;
}

export const useBetaFormSubmission = ({ validateForm, resetErrors }: UseBetaFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const posthog = usePostHog();

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
      posthog?.capture('beta_signup_validation_failed', {
        challenge: challenge,
      });
      return;
    }

    setIsSubmitting(true);
    posthog?.capture('beta_signup_started', {
      challenge: challenge,
      has_company: !!company,
    });

    try {
      const isDuplicate = await checkDuplicateEmail(email);
      if (isDuplicate) {
        toast.error("This email is already registered for our beta program.");
        posthog?.capture('beta_signup_duplicate_email');
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
        posthog?.capture('beta_signup_completed', {
          challenge: challenge,
          has_company: !!company,
        });
        // Identify the user in PostHog
        posthog?.identify(email, {
          name: name,
          company: company || undefined,
          challenge: challenge,
          signup_source: 'beta_form',
        });
        resetForm();
      } else {
        toast.error("Something went wrong. Please try again.");
        posthog?.capture('beta_signup_failed', {
          error: result.error,
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      posthog?.capture('beta_signup_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
};
