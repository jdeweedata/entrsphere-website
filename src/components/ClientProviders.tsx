"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState, useEffect, ReactNode } from "react";

interface ClientProvidersProps {
  children?: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const [convexClient, setConvexClient] = useState<ConvexReactClient | null>(null);
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

  // Create Convex client only on client side
  useEffect(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      setConvexClient(new ConvexReactClient(convexUrl));
    }
  }, []);

  const content = (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

  // Show loading or render without Convex during SSR/initial load
  if (!convexClient) {
    return content;
  }

  return <ConvexProvider client={convexClient}>{content}</ConvexProvider>;
}
