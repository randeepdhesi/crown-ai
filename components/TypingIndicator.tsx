"use client";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-crown-gold/10 flex items-center justify-center">
          <svg width="18" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 14L0 8L4 2L7 7L10 0L13 7L16 2L20 8L20 14Z" fill="#b3874b"/>
            <rect x="0" y="14" width="20" height="2" rx="1" fill="#b3874b"/>
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-2 text-neutral-400 text-base font-medium">
        <span>Thinking</span>
        <span className="animate-pulse">...</span>
      </div>
    </div>
  );
}
