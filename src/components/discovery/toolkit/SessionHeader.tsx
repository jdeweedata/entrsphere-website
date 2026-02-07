"use client";

import Link from "next/link";
import Image from "next/image";
import { DiscoveryRoute, ROUTES } from "@/types/discovery";
import { Button } from "@/components/ui/button";
import {
  ArrowsClockwise,
  ArrowLeft,
  FileCode,
  Download,
} from "@phosphor-icons/react";

interface SessionHeaderProps {
  detectedRoute: DiscoveryRoute;
  generatedSpec: object | null;
  isGeneratingSpec: boolean;
  messagesCount: number;
  onRestart: () => void;
  onGenerateSpec: () => void;
  onDownloadSpec: () => void;
}

export default function SessionHeader({
  detectedRoute,
  generatedSpec,
  isGeneratingSpec,
  messagesCount,
  onRestart,
  onGenerateSpec,
  onDownloadSpec,
}: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-6 py-4 shadow-sm shadow-slate-200/50">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/solutions/discovery-router"
            aria-label="Back to Analysis"
            className="group flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200/80 transition-colors text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/20 blur-md rounded-full" />
              <Image
                src="/entrsphere_asset_icon_transparent.webp"
                alt="EntrSphere"
                width={34}
                height={34}
                className="relative z-10"
              />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 tracking-tight leading-tight">
                Discovery Router Toolkit
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {detectedRoute ? `${ROUTES[detectedRoute].name}` : "Live Session"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onRestart}
            variant="ghost"
            size="sm"
            aria-label="Restart Session"
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 hidden md:flex"
          >
            <ArrowsClockwise className="h-4 w-4 mr-2" />
            Restart
          </Button>

          {generatedSpec ? (
            <Button
              onClick={onDownloadSpec}
              aria-label="Download SPEC.json"
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Download SPEC
            </Button>
          ) : (
            <Button
              onClick={onGenerateSpec}
              disabled={isGeneratingSpec || messagesCount < 4}
              aria-label="Generate SPEC.json"
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileCode className="h-4 w-4 mr-2" />
              {isGeneratingSpec ? "Generating..." : "Generate SPEC"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
