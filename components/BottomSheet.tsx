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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            data-testid="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed bottom-0 left-0 right-0 ${heightClass} bg-neutral-900 rounded-t-2xl z-[60] overflow-y-auto`}
          >
            <div className="w-10 h-1 bg-neutral-600 rounded-full mx-auto mt-3 mb-4" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
