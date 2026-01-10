// Individual chat message component

import { ChatMessage as ChatMessageType } from '@/types/discovery';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAgent = message.role === 'agent';
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
          isAgent && 'bg-white border border-slate-200 text-slate-800',
          isUser && 'bg-slate-900 text-white',
          message.role === 'system' && 'bg-blue-50 border border-blue-200 text-blue-800'
        )}
      >
        {isAgent && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="text-xs font-medium text-slate-500">EntrSphere</span>
          </div>
        )}

        <div className="prose prose-sm prose-slate max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-slate-500 not-italic">{children}</em>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className={cn(
                    'underline hover:no-underline',
                    isUser ? 'text-blue-300' : 'text-blue-600'
                  )}
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
              isUser ? 'text-slate-400' : 'text-slate-400'
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
