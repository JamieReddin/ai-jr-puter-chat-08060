import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-current rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-typing" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-typing" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
    </div>
  );
}