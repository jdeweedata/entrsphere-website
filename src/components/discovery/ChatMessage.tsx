// Individual chat message component
// Brand: EntrSphere Design System - Clean, legible, professional

import Image from "next/image";
import { ChatMessage as ChatMessageType } from "@/types/discovery";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAgent = message.role === "agent" || message.role === "assistant";
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500",
        isUser ? "justify-end" : "justify-start",
        // Add vertical spacing between messages
        "mb-6 last:mb-0"
      )}
    >
      {/* Agent avatar - outside the bubble */}
      {isAgent && (
        <div className="flex-shrink-0 mr-3 mt-0.5">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md shadow-violet-500/10 border border-violet-100 overflow-hidden ring-1 ring-violet-50/50">
            <Image
              src="/entrsphere_asset_icon_transparent.webp"
              alt="EntrSphere"
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative group",
          // Max width for readability
          "max-w-[85%] md:max-w-[75%] lg:max-w-[65%]",
          isSystem && "max-w-full w-full"
        )}
      >
        {/* Agent label */}
        {isAgent && (
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Discovery Agent
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl relative transition-shadow duration-300",
            // Agent messages
            isAgent &&
              "bg-white border border-slate-100 text-slate-800 rounded-tl-sm px-6 py-5 shadow-sm shadow-slate-200/50",
            // User messages - Modern gradient
            isUser &&
              "bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-600 text-white rounded-tr-sm px-6 py-4 shadow-lg shadow-violet-600/20 border border-white/10",
            // System messages
            isSystem &&
              "bg-slate-50/80 border border-slate-200/60 text-slate-600 text-center px-5 py-3 backdrop-blur-sm"
          )}
        >
          {/* Message content with improved typography */}
          <div
            className={cn(
              "prose prose-sm max-w-none text-[15px] leading-7",
              // Agent message typography
              isAgent && [
                "text-slate-600",
                "prose-p:text-slate-600 prose-p:leading-7",
                "prose-strong:text-slate-900 prose-strong:font-bold",
                "prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight",
                "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
                "prose-li:text-slate-600",
                "prose-ul:my-4 prose-ol:my-4",
                "prose-li:my-1.5",
                "prose-a:text-violet-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-violet-700 transition-colors",
                "prose-code:text-violet-600 prose-code:bg-violet-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:before:content-none prose-code:after:content-none",
                "prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:border prose-pre:border-slate-800",
              ],
              // User message typography
              isUser && [
                "text-white/95",
                "prose-p:text-white/95 prose-p:leading-relaxed",
                "prose-strong:text-white prose-strong:font-bold",
                "prose-a:text-white prose-a:underline hover:prose-a:text-white/80",
                "prose-code:text-white prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md",
                "prose-ul:marker:text-white/60",
                "prose-ol:marker:text-white/60",
                "prose-li:my-0.5",
              ]
            )}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-4 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-2 mb-4 last:mb-0 marker:text-currentColor/50">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-2 mb-4 last:mb-0 marker:font-medium marker:text-currentColor/70">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="pl-1">
                    {children}
                  </li>
                ),
                h1: ({ children }) => (
                  <h1 className="mt-6 mb-3 first:mt-0 font-bold text-lg">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-5 mb-2.5 first:mt-0 font-bold text-base">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-4 mb-2 first:mt-0 font-bold text-sm">
                    {children}
                  </h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote className={cn(
                    "border-l-4 pl-4 py-1 my-4 italic text-[14px]",
                    isUser ? "border-white/30 text-white/80" : "border-violet-200 text-slate-500"
                  )}>
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className={cn(
                    "px-1.5 py-0.5 rounded-md text-[13px] font-medium font-mono",
                    isUser ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                  )}>
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Timestamp - subtle, below the bubble */}
        <div
          className={cn(
            "mt-2 text-[10px] font-medium text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            isUser ? "text-right pr-2" : "text-left pl-2"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
