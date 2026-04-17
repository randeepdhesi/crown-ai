import { useState, useEffect, useRef } from "react";

const CHARS_PER_FRAME = 8; // ~480 chars/sec at 60 fps — fewer renders, same smooth feel

export function useSmoothStream(content: string, isComplete: boolean): string {
  const [displayed, setDisplayed] = useState(isComplete ? content : "");
  const rafRef = useRef<number | null>(null);
  const contentRef = useRef(content);
  const displayedLenRef = useRef(isComplete ? content.length : 0);

  // Keep content ref fresh without triggering the effect
  contentRef.current = content;

  useEffect(() => {
    if (isComplete) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      displayedLenRef.current = contentRef.current.length;
      setDisplayed(contentRef.current);
      return;
    }

    const tick = () => {
      const full = contentRef.current;
      const cur = displayedLenRef.current;
      if (cur < full.length) {
        const next = Math.min(cur + CHARS_PER_FRAME, full.length);
        displayedLenRef.current = next;
        setDisplayed(full.slice(0, next));
      }
      // Always reschedule — new content may arrive on next frame
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isComplete]);

  return displayed;
}
