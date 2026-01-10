import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_API_KEY;
// Use reverse proxy in production to bypass ad blockers
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "/ingest";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (POSTHOG_KEY) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        ui_host: "https://us.posthog.com", // Required for toolbar with reverse proxy
        person_profiles: "identified_only",
        capture_pageview: false, // We capture manually for SPA
        capture_pageleave: true,
      });
      // Expose to window for PostHog toolbar and debugging
      (window as typeof window & { posthog: typeof posthog }).posthog = posthog;
    }
  }, []);

  if (!POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Track page views for SPA navigation
export function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
      });
    }
  }, [location, posthog]);

  return null;
}

export { posthog };
