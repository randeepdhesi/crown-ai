"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  heightClass: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, heightClass, children }: BottomSheetProps) {
  const dragControls = useDragControls();

  return (
    <>
      {/* Backdrop */}
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

      {/* Sheet panel — capped so it never covers the TopNav (h-14 = 3.5rem) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sheet-panel"
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 200) onClose();
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className={`fixed bottom-0 left-0 right-0 ${heightClass} max-h-[calc(100dvh-3.5rem)] bg-neutral-900 rounded-t-3xl md:rounded-t-none md:rounded-tr-[2rem] z-[70] flex flex-col md:w-[400px] md:right-auto`}
          >
            {/* Drag handle — only this initiates the drag gesture */}
            <div
              className="flex-shrink-0 pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-neutral-600 rounded-full mx-auto" />
            </div>

            {/* Scrollable content — pointer events here don't trigger drag */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto w-full pb-4">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
