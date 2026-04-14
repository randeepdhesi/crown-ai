"use client";

import CrownLogo from "./CrownLogo";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-crown-gold/10 flex items-center justify-center">
          <CrownLogo size={20} />
        </div>
      </div>
      <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex gap-1.5 items-center h-5">
          <div className="typing-dot w-2 h-2 rounded-full bg-crown-gold" />
          <div className="typing-dot w-2 h-2 rounded-full bg-crown-gold" />
          <div className="typing-dot w-2 h-2 rounded-full bg-crown-gold" />
        </div>
      </div>
    </div>
  );
}
