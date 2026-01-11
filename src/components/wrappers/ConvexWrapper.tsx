"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState, useEffect } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export function ConvexWrapper({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    if (convexUrl) {
      setClient(new ConvexReactClient(convexUrl));
    }
  }, []);

  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
