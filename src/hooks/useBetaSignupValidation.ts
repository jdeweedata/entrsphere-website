
import { useState } from 'react';

export interface FormErrors {
  nameError: boolean;
  emailError: boolean;
  challengeError: boolean;
}

export const useBetaSignupValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({
    nameError: false,
    emailError: false,
    challengeError: false,
  });

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateForm = (name: string, email: string, challenge: string, otherChallenge: string) => {
    const newErrors: FormErrors = {
      nameError: false,
      emailError: false,
      challengeError: false,
    };

    let isValid = true;

    if (!name.trim()) {
      newErrors.nameError = true;
      isValid = false;
    }
    if (!email.trim() || !validateEmail(email)) {
      newErrors.emailError = true;
      isValid = false;
    }
    if (!challenge) {
      newErrors.challengeError = true;
      isValid = false;
    }
    if (challenge === "other" && !otherChallenge.trim()) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetErrors = () => {
    setErrors({
      nameError: false,
      emailError: false,
      challengeError: false,
    });
  };

  return {
    errors,
    validateForm,
    resetErrors,
  };
};
