"use client";

import { useCallback, useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@phosphor-icons/react";

// Discovery Router Toolkit pricing
const TOOLKIT_PRICE_ZAR = 85000; // R850 in kobo (cents)
const PRODUCT_ID = "discovery-router-toolkit";

interface PaystackButtonProps {
  email: string;
  sessionId?: string;
  route?: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function PaystackButton({
  email,
  sessionId,
  route,
  onSuccess,
  onClose,
  children,
  className,
  disabled,
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reference, setReference] = useState<string>("");
  const [shouldInitialize, setShouldInitialize] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
  const createPurchase = useMutation(api.payments.createPurchase);

  const config = {
    reference,
    email,
    amount: TOOLKIT_PRICE_ZAR,
    publicKey,
    currency: "ZAR",
    metadata: {
      custom_fields: [
        { display_name: "Product", variable_name: "product", value: PRODUCT_ID },
        { display_name: "Session ID", variable_name: "sessionId", value: sessionId || "" },
        { display_name: "Route", variable_name: "route", value: route || "" },
      ],
    },
  };

  const handlePaystackSuccess = useCallback(
    async (response: { reference: string }) => {
      setIsLoading(true);
      try {
        // Verify payment with backend
        const verifyResponse = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: response.reference }),
        });

        const data = await verifyResponse.json();

        if (data.success) {
          onSuccess(response.reference);
        } else {
          console.error("Payment verification failed:", data);
          // Still allow access if Paystack says success but our backend failed
          onSuccess(response.reference);
        }
      } catch (error) {
        console.error("Verification error:", error);
        // Still allow access - payment was successful at Paystack
        onSuccess(response.reference);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess]
  );

  const handlePaystackClose = useCallback(() => {
    setIsLoading(false);
    setShouldInitialize(false);
    onClose?.();
  }, [onClose]);

  const initializePayment = usePaystackPayment(config);

  // Effect to trigger payment when reference is set
  useEffect(() => {
    if (shouldInitialize && reference) {
      initializePayment({
        onSuccess: handlePaystackSuccess,
        onClose: handlePaystackClose,
      });
      setShouldInitialize(false);
    }
  }, [shouldInitialize, reference, initializePayment, handlePaystackSuccess, handlePaystackClose]);

  const handleClick = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    if (!publicKey) {
      alert("Payment system not configured. Please contact support.");
      return;
    }

    setIsLoading(true);

    // Generate unique reference
    const newReference = `toolkit_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    try {
      // Create pending purchase record before initiating payment
      await createPurchase({
        email,
        sessionId,
        reference: newReference,
        amount: TOOLKIT_PRICE_ZAR,
        currency: "ZAR",
        product: PRODUCT_ID,
      });

      setReference(newReference);
      setShouldInitialize(true);
    } catch (error) {
      console.error("Failed to create purchase record:", error);
      alert("Failed to initialize payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading || !email}
      className={className}
    >
      {isLoading ? (
        <>
          <Spinner className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

// Helper to format price for display
export function formatPrice(kobo: number): string {
  return `R${(kobo / 100).toLocaleString("en-ZA")}`;
}

export { TOOLKIT_PRICE_ZAR, PRODUCT_ID };
