"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
let convexClient: ConvexReactClient | null = null;

if (typeof window !== "undefined" && convexUrl) {
  convexClient = new ConvexReactClient(convexUrl);
}

export function ClientProviders() {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const content = (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

  if (convexClient) {
    return <ConvexProvider client={convexClient}>{content}</ConvexProvider>;
  }

  return content;
}
