"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ChatCircleDots } from "@phosphor-icons/react";

interface SpecPreviewCardProps {
  spec: object;
  isAskAnythingMode: boolean;
  onDownload: () => void;
  onAskAnything: () => void;
}

export default function SpecPreviewCard({
  spec,
  isAskAnythingMode,
  onDownload,
  onAskAnything,
}: SpecPreviewCardProps) {
  return (
    <div className="relative group mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-2xl shadow-slate-900/10 animate-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400">
            SPEC.json
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest">
            Generated
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-0 relative font-mono text-xs">
        <div className="absolute top-0 right-0 p-4 pointer-events-none bg-gradient-to-l from-slate-900 via-transparent to-transparent h-full w-20 z-10" />
        <ScrollArea className="h-64 w-full">
          <div className="p-4">
            <pre className="text-emerald-300/90 leading-relaxed">
              {JSON.stringify(spec, null, 2)}
            </pre>
          </div>
        </ScrollArea>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-3 p-3 bg-slate-900 border-t border-slate-800">
        <Button
          onClick={onDownload}
          size="sm"
          aria-label="Download SPEC as JSON"
          className="bg-green-600 hover:bg-green-500 text-white border-0"
        >
          <Download className="h-3.5 w-3.5 mr-2" />
          Download
        </Button>
        {!isAskAnythingMode && (
          <Button
            onClick={onAskAnything}
            variant="ghost"
            size="sm"
            aria-label="Ask questions"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ChatCircleDots className="h-3.5 w-3.5 mr-2" />
            Ask Questions
          </Button>
        )}
      </div>
    </div>
  );
}
