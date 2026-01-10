// Typing indicator for agent messages
// Brand: EntrSphere Liquid Tech Design System

import { Sphere } from '@phosphor-icons/react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-[#2069A8] to-[#88D2E8] flex items-center justify-center shadow-sm shadow-[#88D2E8]/30 animate-pulse">
        <Sphere weight="duotone" className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-blue-200 mr-2">EntrSphere is thinking</span>
        <span className="w-2 h-2 bg-[#88D2E8] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-[#88D2E8] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-[#88D2E8] rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default TypingIndicator;
