// Typing indicator for agent messages

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex items-center gap-1">
        <span className="text-sm text-slate-500 mr-2">EntrSphere is thinking</span>
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default TypingIndicator;
