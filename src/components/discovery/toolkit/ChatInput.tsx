"use client";

import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isAskAnythingMode: boolean;
  tokenUsage: { input: number; output: number };
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ value, onChange, onSend, isLoading, isAskAnythingMode, tokenUsage }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    };

    return (
      <div className="relative z-50">
        {/* Gradient fade above input */}
        <div className="absolute bottom-full left-0 right-0 h-12 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />

        <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/60 px-4 md:px-6 py-5 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:shadow-md focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all duration-300 p-2">
              <Input
                ref={ref}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isAskAnythingMode
                    ? "What would you like to know about your project?"
                    : "Describe your requirements here... (Press '/' to focus)"
                }
                disabled={isLoading}
                className="flex-1 h-auto min-h-[44px] py-3 px-3 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-[15px] resize-none"
                aria-label="Chat Input"
              />
              <Button
                onClick={onSend}
                disabled={!value.trim() || isLoading}
                aria-label="Send Message"
                className={cn(
                  "relative h-10 w-10 p-0 rounded-xl transition-all duration-300",
                  value.trim()
                    ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/25 rotate-0 scale-100"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed rotate-6 scale-90"
                )}
              >
                <PaperPlaneTilt weight="fill" className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isLoading ? "bg-violet-500 animate-pulse" : "bg-green-500"
                    )}
                  />
                  {isLoading ? "Thinking..." : "Ready"}
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                {tokenUsage.input + tokenUsage.output > 0 &&
                  `${((tokenUsage.input + tokenUsage.output) / 1000).toFixed(1)}k tokens used`}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
