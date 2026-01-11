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
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
        // Add vertical spacing between messages
        "mb-5 last:mb-0"
      )}
    >
      {/* Agent avatar - outside the bubble */}
      {isAgent && (
        <div className="flex-shrink-0 mr-3 mt-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shadow-sm border border-slate-200/60 overflow-hidden">
            <Image
              src="/entrsphere_asset_icon_transparent.webp"
              alt="EntrSphere"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative",
          // Max width for readability
          "max-w-[80%] md:max-w-[70%] lg:max-w-[65%]",
          isSystem && "max-w-full w-full"
        )}
      >
        {/* Agent label */}
        {isAgent && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Discovery Agent
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl shadow-sm",
            // Agent messages - clean white with subtle border
            isAgent &&
              "bg-white border border-slate-200/80 text-slate-800 rounded-tl-md px-5 py-4",
            // User messages - gradient with good contrast
            isUser &&
              "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-md px-5 py-4 shadow-md shadow-blue-500/15",
            // System messages - subtle centered
            isSystem &&
              "bg-slate-100/80 border border-slate-200 text-slate-600 text-center px-5 py-3"
          )}
        >
          {/* Message content with improved typography */}
          <div
            className={cn(
              "prose prose-sm max-w-none",
              // Better line height for readability
              "leading-relaxed",
              // Agent message typography
              isAgent && [
                "prose-p:text-slate-700 prose-p:text-[15px] prose-p:leading-relaxed",
                "prose-strong:text-slate-900 prose-strong:font-semibold",
                "prose-headings:text-slate-900 prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2",
                "prose-h1:text-lg prose-h2:text-base prose-h3:text-sm",
                "prose-li:text-slate-700 prose-li:text-[15px]",
                "prose-ul:my-3 prose-ol:my-3",
                "prose-li:my-1",
                "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
              ],
              // User message typography
              isUser && [
                "prose-invert",
                "prose-p:text-white prose-p:text-[15px] prose-p:leading-relaxed",
                "prose-strong:text-white prose-strong:font-semibold",
                "prose-a:text-blue-200 prose-a:underline",
              ]
            )}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-1.5 my-3">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-1.5 my-3">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-[15px] leading-relaxed pl-1">
                    {children}
                  </li>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-semibold mt-4 mb-2 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold mt-4 mb-2 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mt-3 mb-1.5 first:mt-0">
                    {children}
                  </h3>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-3 border-slate-300 pl-4 my-3 text-slate-600 italic">
                    {children}
                  </blockquote>
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
            "mt-1.5 text-[11px] font-medium text-slate-400",
            isUser ? "text-right pr-1" : "text-left pl-1"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* User avatar placeholder for alignment (optional) */}
      {isUser && <div className="flex-shrink-0 w-9 ml-3" />}
    </div>
  );
};

export default ChatMessage;
