// Individual chat message component
// Brand: EntrSphere Glass Design System

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
  const isSystem = message.role === 'system';

  return (
    <div
      className={cn(
        'flex w-full mb-6',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-4 shadow-sm relative overflow-hidden',
          isAgent && 'bg-white/90 backdrop-blur-md border border-white/60 !text-slate-900 rounded-tl-none shadow-sm',
          isUser && 'bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-tr-none shadow-md',
          isSystem && 'bg-slate-100/80 border border-slate-200 text-slate-700 w-full max-w-full text-center'
        )}
      >
        {isAgent && (
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center border border-white/50">
              <Sphere weight="duotone" className="h-3 w-3 text-violet-600" />
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Discovery Agent</span>
          </div>
        )}

        <div className={cn(
          "prose prose-sm max-w-none leading-relaxed",
          isAgent && "prose-p:!text-slate-900 prose-strong:!text-black prose-li:!text-slate-900 prose-headings:!text-slate-900",
          isUser && "prose-invert prose-p:text-white/95 prose-a:text-white underline-offset-2"
        )}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mt-2 marker:text-slate-400">{children}</ul>
              ),
              li: ({ children }) => <li className="text-sm">{children}</li>,
              a: ({ href, children }) => (
                <a href={href} className="underline decoration-current/30 hover:decoration-current transition-all" target="_blank" rel="noopener noreferrer">{children}</a>
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        <div className={cn("mt-2 text-[10px] font-medium opacity-60", isUser ? "text-right text-white" : "text-right text-slate-400")}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
