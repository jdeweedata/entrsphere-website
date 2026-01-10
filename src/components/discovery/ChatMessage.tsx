// Individual chat message component
// Brand: EntrSphere Liquid Tech Design System

import { ChatMessage as ChatMessageType } from '@/types/discovery';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Sphere } from '@phosphor-icons/react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAgent = message.role === 'agent' || message.role === 'assistant';
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3',
          isAgent && 'bg-[#2069A8]/10 backdrop-blur-md border border-[#88D2E8]/20 text-blue-100',
          isUser && 'bg-gradient-to-r from-[#2069A8] to-[#88D2E8] text-white',
          message.role === 'system' && 'bg-[#88D2E8]/10 border border-[#88D2E8]/30 text-[#88D2E8]'
        )}
      >
        {isAgent && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-[#2069A8] to-[#88D2E8] flex items-center justify-center shadow-sm shadow-[#88D2E8]/30">
              <Sphere weight="duotone" className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs font-medium text-[#88D2E8]">EntrSphere</span>
          </div>
        )}

        <div className={cn(
          "prose prose-sm max-w-none",
          isAgent && "prose-invert prose-p:text-blue-100 prose-strong:text-white prose-li:text-blue-100",
          isUser && "prose-invert prose-p:text-white prose-strong:text-white"
        )}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-white">{children}</strong>
              ),
              em: ({ children }) => (
                <em className={cn(
                  "not-italic",
                  isUser ? "text-blue-100" : "text-[#88D2E8]"
                )}>{children}</em>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-[#88D2E8] underline hover:no-underline"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mt-2">{children}</ul>
              ),
              li: ({ children }) => <li className="text-sm">{children}</li>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        <div className="mt-2 text-right">
          <span
            className={cn(
              'text-xs',
              isUser ? 'text-blue-200' : 'text-blue-300/60'
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
