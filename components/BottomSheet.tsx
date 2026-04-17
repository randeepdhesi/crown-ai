"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  heightClass: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, heightClass, children }: BottomSheetProps) {
  return (
    <>
      {/* Backdrop — separate AnimatePresence so it tracks independently */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sheet-backdrop"
            data-testid="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sheet panel — slides up from bottom, z-[70] sits above backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sheet-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className={`fixed bottom-0 left-0 right-0 ${heightClass} bg-neutral-900 rounded-t-2xl z-[70] overflow-y-auto`}
          >
            <div className="w-10 h-1 bg-neutral-600 rounded-full mx-auto mt-3 mb-4" />
            <div className="max-w-2xl mx-auto w-full">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
