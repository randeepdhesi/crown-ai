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
      <div className="flex items-center gap-2 border-l-[3px] border-crown-gold rounded-tl-md bg-neutral-800/20 px-4 py-3 rounded-2xl rounded-tl-md">
        <span className="text-sm text-neutral-400">Crown AI is thinking</span>
        <span className="flex gap-[3px] items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="typing-dot w-1 h-1 rounded-full bg-crown-gold/60 inline-block"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
