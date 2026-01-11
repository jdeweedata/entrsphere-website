// Typing indicator for agent messages
// Brand: EntrSphere Design System

import Image from "next/image";

const TypingIndicator = () => {
  return (
    <div className="flex w-full justify-start mb-5">
      {/* Agent avatar */}
      <div className="flex-shrink-0 mr-3 mt-1">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shadow-sm border border-slate-200/60 overflow-hidden">
          <Image
            src="/entrsphere_asset_icon_transparent.webp"
            alt="EntrSphere"
            width={24}
            height={24}
            className="w-6 h-6 animate-pulse"
          />
        </div>
      </div>

      <div className="relative max-w-[80%] md:max-w-[70%] lg:max-w-[65%]">
        {/* Agent label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Discovery Agent
          </span>
        </div>

        {/* Typing bubble */}
        <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 font-medium">Thinking</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
