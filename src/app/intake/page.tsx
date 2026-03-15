"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Spinner } from "@phosphor-icons/react";

const REVENUE_OPTIONS = [
  "Under R50K/month",
  "R50K–R100K/month",
  "R100K–R200K/month",
  "R200K–R300K/month",
  "R300K+/month",
];

const BUSINESS_TYPES = [
  "Professional Services",
  "Trade / Construction",
  "B2B Services",
  "Retail / E-commerce",
  "Hospitality",
  "Health & Wellness",
  "Other",
];

function IntakeFormContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const purchase = useQuery(
    api.payments.getPurchaseByReference,
    reference ? { reference } : "skip"
  );

  const submitIntake = useMutation(api.intakeSubmissions.submit);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    websiteUrl: "",
    monthlyRevenue: "",
    businessType: "",
    biggestChallenge: "",
  });

  if (!reference) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Missing payment reference. Please complete payment first.
          </p>
          <a href="/#pricing" className="text-primary hover:underline mt-4 inline-block">
            View pricing
          </a>
        </div>
      </div>
    );
  }

  if (purchase === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!purchase || purchase.status !== "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Payment not yet confirmed. Please wait a moment and refresh.
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-primary" weight="fill" />
          </div>
          <h1 className="font-display text-2xl text-foreground italic mb-3">
            We're On It
          </h1>
          <p className="text-muted-foreground mb-2">
            Thanks! We've received your details and will begin your audit
            within 24 hours.
          </p>
          <p className="text-muted-foreground/60 text-sm">
            Check your email for confirmation.
          </p>
        </div>
      </div>
    );
  }

  const tier = (purchase.product || "quick-scan") as
    | "quick-scan"
    | "deep-dive"
    | "full-audit";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.businessName || !form.contactName || !form.email) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitIntake({
        purchaseReference: reference,
        email: form.email,
        businessName: form.businessName,
        contactName: form.contactName,
        phone: form.phone || undefined,
        websiteUrl: form.websiteUrl || undefined,
        monthlyRevenue: form.monthlyRevenue || undefined,
        businessType: form.businessType || undefined,
        biggestChallenge: form.biggestChallenge || undefined,
        tier,
      });

      // Send notification email (fire and forget)
      fetch("/api/notify/audit-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tier, purchaseReference: reference }),
      }).catch(() => {});

      setIsSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
            Payment Received
          </p>
          <h1 className="font-display text-3xl text-foreground italic mb-3">
            One More Step
          </h1>
          <p className="text-muted-foreground">
            Tell us about your business so we can start your audit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName" className="text-sm text-muted-foreground">
                Business Name *
              </Label>
              <Input
                id="businessName"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="mt-1 bg-secondary/50"
                required
              />
            </div>
            <div>
              <Label htmlFor="contactName" className="text-sm text-muted-foreground">
                Your Name *
              </Label>
              <Input
                id="contactName"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="mt-1 bg-secondary/50"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 bg-secondary/50"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm text-muted-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 bg-secondary/50"
                placeholder="+27 ..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="websiteUrl" className="text-sm text-muted-foreground">
              Website URL
            </Label>
            <Input
              id="websiteUrl"
              type="url"
              value={form.websiteUrl}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              className="mt-1 bg-secondary/50"
              placeholder="https://yoursite.co.za"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Monthly Revenue
              </Label>
              <Select
                value={form.monthlyRevenue}
                onValueChange={(v) => setForm({ ...form, monthlyRevenue: v })}
              >
                <SelectTrigger className="mt-1 bg-secondary/50">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {REVENUE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Business Type
              </Label>
              <Select
                value={form.businessType}
                onValueChange={(v) => setForm({ ...form, businessType: v })}
              >
                <SelectTrigger className="mt-1 bg-secondary/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="biggestChallenge" className="text-sm text-muted-foreground">
              What's your biggest business challenge right now?
            </Label>
            <Textarea
              id="biggestChallenge"
              value={form.biggestChallenge}
              onChange={(e) =>
                setForm({ ...form, biggestChallenge: e.target.value })
              }
              className="mt-1 bg-secondary/50 min-h-[100px]"
              placeholder="Tell us what keeps you up at night..."
            />
          </div>

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5 font-medium"
          >
            {isSubmitting ? (
              <>
                <Spinner className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit & Start My Audit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function IntakePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Spinner className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <IntakeFormContent />
    </Suspense>
  );
}
