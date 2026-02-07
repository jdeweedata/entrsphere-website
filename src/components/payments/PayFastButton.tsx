"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@phosphor-icons/react";

// Discovery Router Toolkit pricing (same as Paystack)
const TOOLKIT_PRICE_ZAR = 85000; // R850 in cents
const PRODUCT_ID = "discovery-router-toolkit";

interface PayFastButtonProps {
  email: string;
  sessionId?: string;
  nameFirst?: string;
  nameLast?: string;
  itemName?: string;
  itemDescription?: string;
  amount?: number; // Amount in cents (defaults to TOOLKIT_PRICE_ZAR)
  product?: string; // Product ID (defaults to PRODUCT_ID)
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface PayFastFormData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_str1?: string;
  custom_str2?: string;
  signature: string;
}

export default function PayFastButton({
  email,
  sessionId,
  nameFirst,
  nameLast,
  itemName = "Discovery Router Toolkit",
  itemDescription = "Strategic project routing framework with AI-powered assessment",
  amount = TOOLKIT_PRICE_ZAR,
  product = PRODUCT_ID,
  onSuccess,
  onError,
  children,
  className,
  disabled,
}: PayFastButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<PayFastFormData | null>(null);
  const [actionUrl, setActionUrl] = useState<string>("");

  // Submit form when formData is set
  useEffect(() => {
    if (formData && actionUrl && formRef.current) {
      formRef.current.submit();
    }
  }, [formData, actionUrl]);

  const handleClick = async () => {
    if (!email) {
      onError?.("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      // Call our API to initiate payment
      const response = await fetch("/api/payments/payfast/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount,
          product,
          itemName,
          itemDescription,
          sessionId,
          nameFirst,
          nameLast,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      // Store reference for potential callback
      if (typeof window !== "undefined") {
        sessionStorage.setItem("payfast_reference", data.paymentId);
      }

      // Set form data and action URL to trigger form submission
      setFormData(data.formData);
      setActionUrl(data.actionUrl);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Failed to initialize payment");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading || !email}
        className={className}
      >
        {isLoading ? (
          <>
            <Spinner className="h-4 w-4 mr-2 animate-spin" />
            Redirecting to PayFast...
          </>
        ) : (
          children
        )}
      </Button>

      {/* Hidden form for PayFast redirect */}
      {formData && actionUrl && (
        <form
          ref={formRef}
          action={actionUrl}
          method="POST"
          style={{ display: "none" }}
        >
          <input type="hidden" name="merchant_id" value={formData.merchant_id} />
          <input type="hidden" name="merchant_key" value={formData.merchant_key} />
          <input type="hidden" name="return_url" value={formData.return_url} />
          <input type="hidden" name="cancel_url" value={formData.cancel_url} />
          <input type="hidden" name="notify_url" value={formData.notify_url} />
          {formData.name_first && (
            <input type="hidden" name="name_first" value={formData.name_first} />
          )}
          {formData.name_last && (
            <input type="hidden" name="name_last" value={formData.name_last} />
          )}
          {formData.email_address && (
            <input type="hidden" name="email_address" value={formData.email_address} />
          )}
          <input type="hidden" name="m_payment_id" value={formData.m_payment_id} />
          <input type="hidden" name="amount" value={formData.amount} />
          <input type="hidden" name="item_name" value={formData.item_name} />
          {formData.item_description && (
            <input type="hidden" name="item_description" value={formData.item_description} />
          )}
          {formData.custom_str1 && (
            <input type="hidden" name="custom_str1" value={formData.custom_str1} />
          )}
          {formData.custom_str2 && (
            <input type="hidden" name="custom_str2" value={formData.custom_str2} />
          )}
          <input type="hidden" name="signature" value={formData.signature} />
        </form>
      )}
    </>
  );
}

// Helper to format price for display
export function formatPrice(cents: number): string {
  return `R${(cents / 100).toLocaleString("en-ZA")}`;
}

export { TOOLKIT_PRICE_ZAR, PRODUCT_ID };
