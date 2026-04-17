"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useChatContext } from "./ChatProvider";
import { useUIState } from "./UIStateProvider";
import { BottomSheet } from "./BottomSheet";
import { SheetCatalogSelector } from "./SheetCatalogSelector";
import { SheetSettings } from "./SheetSettings";

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

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
        <div className="bg-neutral-800/80 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 flex flex-col gap-2 shadow-2xl">
          {/* Toolbar: Catalog source pill */}
          <div className="flex items-center">
            <button
              onClick={() => setOpenSheet("catalog")}
              className="bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-xs rounded-full px-3 py-1 font-medium transition-colors"
            >
              {selectedSource}
            </button>
          </div>

          {/* Input row */}
          <form ref={formRef} onSubmit={handleSubmit} className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-white placeholder:text-neutral-500 py-1.5"
              disabled={isLoading}
            />

            {isSpeechSupported && (
              <motion.button
                type="button"
                onClick={toggleListening}
                disabled={isLoading}
                animate={isListening ? { scale: [1, 1.12, 1] } : undefined}
                transition={
                  isListening
                    ? { repeat: Infinity, duration: 0.9 }
                    : undefined
                }
                className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-neutral-700 hover:bg-neutral-600 disabled:cursor-not-allowed"
                }`}
                aria-label={isListening ? "Stop recording" : "Start voice input"}
              >
                {isListening ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 10a7 7 0 0 0 14 0" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="9" y1="22" x2="15" y2="22" />
                  </svg>
                )}
              </motion.button>
            )}

            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              animate={isLoading ? { scale: [1, 1.12, 1] } : undefined}
              transition={
                isLoading ? { repeat: Infinity, duration: 0.9 } : undefined
              }
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-crown-gold hover:bg-crown-gold-dark disabled:bg-neutral-700 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </motion.button>
          </form>
        </div>
      </div>

      {/* Settings Sheet (90vh) — triggered by TopNav profile button via UIStateContext */}
      <BottomSheet
        isOpen={openSheet === "settings"}
        onClose={() => setOpenSheet(null)}
        heightClass="h-[90vh]"
      >
        <SheetSettings onClose={() => setOpenSheet(null)} />
      </BottomSheet>

      {/* Catalog Sheet (2/3 height) — triggered by Catalog pill button above */}
      <BottomSheet
        isOpen={openSheet === "catalog"}
        onClose={() => setOpenSheet(null)}
        heightClass="h-2/3"
      >
        <SheetCatalogSelector onClose={() => setOpenSheet(null)} />
      </BottomSheet>
    </>
  );
}
