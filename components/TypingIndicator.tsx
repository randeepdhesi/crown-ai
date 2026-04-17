"use client";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src="/icon-192.png" alt="Crown AI" width={32} height={32} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-neutral-400 text-base font-medium">
        <span>Thinking</span>
        <span className="animate-pulse">...</span>
      </div>
    </div>
  );
}
