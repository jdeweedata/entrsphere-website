"use client";

import { useState, useCallback } from "react";
import { usePaystackPayment } from "react-paystack";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Discovery Router Toolkit pricing
const TOOLKIT_PRICE_ZAR = 85000; // R850 in kobo (cents)
const PRODUCT_ID = "discovery-router-toolkit";

interface PaymentConfig {
  email: string;
  sessionId?: string;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
}

interface PaymentResult {
  success: boolean;
  reference?: string;
  error?: string;
}

export function useToolkitPayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createPurchase = useMutation(api.payments.createPurchase);

  const initializePayment = useCallback(
    async (config: PaymentConfig): Promise<string> => {
      // Generate unique reference
      const reference = `toolkit_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Create pending purchase in Convex
      await createPurchase({
        email: config.email,
        sessionId: config.sessionId,
        reference,
        amount: TOOLKIT_PRICE_ZAR,
        currency: "ZAR",
        product: PRODUCT_ID,
      });

      return reference;
    },
    [createPurchase]
  );

  const verifyPayment = useCallback(
    async (reference: string): Promise<PaymentResult> => {
      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();

        if (data.success) {
          return { success: true, reference };
        } else {
          return { success: false, error: data.message || "Payment verification failed" };
        }
      } catch (err) {
        return { success: false, error: "Failed to verify payment" };
      }
    },
    []
  );

  return {
    initializePayment,
    verifyPayment,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    TOOLKIT_PRICE_ZAR,
    PRODUCT_ID,
  };
}

// Paystack configuration component props
export interface PaystackButtonProps {
  email: string;
  sessionId?: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

// Helper to format price for display
export function formatPrice(kobo: number): string {
  return `R${(kobo / 100).toLocaleString("en-ZA")}`;
}
