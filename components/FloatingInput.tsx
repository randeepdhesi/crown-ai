"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useChatContext } from "./ChatProvider";
import { useUIState } from "./UIStateProvider";

// Keyframe height sequences (px) for animated waveform bars — closed loop (first === last)
const BAR_KEYFRAMES = [
  [4, 10, 5, 12, 4],
  [6, 4, 12, 7, 6],
  [10, 7, 4, 10, 10],
  [4, 12, 8, 5, 4],
];

export function FloatingInput() {
  const pathname = usePathname();
  const {
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    isListening,
    toggleListening,
    isSpeechSupported,
  } = useChatContext();
  const { setOpenSheet, selectedSource } = useUIState();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const hasText = input.trim().length > 0;
  const placeholder =
    pathname === "/catalog"
      ? "Search the full catalog..."
      : "Ask about products, specs...";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function handleActionClick() {
    if (hasText) {
      formRef.current?.requestSubmit();
    } else if (isSpeechSupported) {
      toggleListening();
    }
  }

  const buttonBg = "bg-[#b3874b] hover:bg-[#96703d]";

  if (pathname !== "/" && pathname !== "/catalog") return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
      <div className="bg-neutral-800/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="flex flex-col px-4 pt-3 pb-2 gap-2">

            {/* Row 1: Textarea — full width, taller */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={2}
              className="w-full min-h-[60px] bg-transparent border-none outline-none resize-none text-base text-white placeholder:text-neutral-400 leading-relaxed"
              disabled={isLoading}
            />

            {/* Row 2: Context pill (left) + Action button (right) */}
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenSheet("catalog")}
                  className="bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-xs rounded-full px-3 py-1 font-medium transition-colors"
                >
                  {selectedSource}
                </button>
              </div>

              {/* Unified action button — circle */}
              <motion.button
                type="button"
                onClick={handleActionClick}
                disabled={isLoading}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonBg}`}
                aria-label={hasText ? "Send message" : "Listening"}
              >
                {hasText ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                ) : (
                  <div className="flex items-end gap-[2px] h-4">
                    {BAR_KEYFRAMES.map((frames, i) => (
                      <motion.span
                        key={i}
                        className="w-[3px] rounded-full bg-black"
                        animate={{ height: frames.map((h) => `${h}px`) }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
                        style={{ height: `${frames[0]}px` }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
