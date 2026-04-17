"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useChatContext } from "./ChatProvider";
import { useUIState } from "./UIStateProvider";
import { BottomSheet } from "./BottomSheet";
import { SheetCatalogSelector } from "./SheetCatalogSelector";
import { SheetSettings } from "./SheetSettings";

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
  const { openSheet, setOpenSheet, selectedSource } = useUIState();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const hasText = input.trim().length > 0;

  const placeholder =
    pathname === "/catalog"
      ? "Search the full catalog..."
      : "Ask about products, specs...";

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

  const isActive = isListening || hasText;
  const buttonBg = isActive ? "bg-[#b3874b] hover:bg-[#96703d]" : "bg-neutral-700 hover:bg-neutral-600";

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
        <div className="bg-neutral-800/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="flex w-full items-center gap-3 px-3 py-2">

              {/* Context pill */}
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenSheet("catalog")}
                  className="bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-xs rounded-full px-3 py-1 font-medium transition-colors"
                >
                  {selectedSource}
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="flex-grow min-h-[40px] bg-transparent border-none outline-none resize-none text-base text-white placeholder:text-neutral-400 py-2"
                disabled={isLoading}
              />

              {/* Unified action button — circle */}
              <motion.button
                type="button"
                onClick={handleActionClick}
                disabled={!isListening && (isLoading || (!isSpeechSupported && !hasText))}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:pointer-events-none ${buttonBg}`}
                aria-label={
                  hasText ? "Send message" : isListening ? "Stop listening" : "Start voice input"
                }
              >
                {hasText ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                ) : isListening ? (
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
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 10a7 7 0 0 0 14 0" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="9" y1="22" x2="15" y2="22" />
                  </svg>
                )}
              </motion.button>

            </div>
          </form>
        </div>
      </div>

      <BottomSheet isOpen={openSheet === "settings"} onClose={() => setOpenSheet(null)} heightClass="h-[90vh]">
        <SheetSettings onClose={() => setOpenSheet(null)} />
      </BottomSheet>

      <BottomSheet isOpen={openSheet === "catalog"} onClose={() => setOpenSheet(null)} heightClass="h-2/3">
        <SheetCatalogSelector onClose={() => setOpenSheet(null)} />
      </BottomSheet>
    </>
  );
}
