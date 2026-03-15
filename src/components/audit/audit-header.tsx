"use client";

import { Button } from "@/components/ui/button";

export default function AuditHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-display text-xl text-foreground italic">
          EntrSphere
        </a>
        <Button
          size="sm"
          onClick={() =>
            document
              .getElementById("pricing")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        >
          Get Your Audit
        </Button>
      </div>
    </header>
  );
}
