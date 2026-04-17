"use client";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="Crown AI" width={28} height={28} className="object-contain" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-neutral-400 text-base font-medium">
        <span>Thinking</span>
        <span className="animate-pulse">...</span>
      </div>
    </div>
  );
}
