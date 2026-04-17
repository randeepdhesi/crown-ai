# UI Polish & Responsive Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Crown AI UI with stub pages, responsive transitions, desktop-aware TopNav, a 2×2 suggested-questions grid, and a unified action button in the input bar.

**Architecture:** All changes are in existing Next.js app/components. No new libraries needed — Framer Motion, Tailwind, and Lucide are already installed. The unified action button merges the separate mic and submit buttons into one context-sensitive control.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion 12, Lucide React, React Testing Library/Jest

---

## File Map

| Action | File |
|--------|------|
| Create | `app/catalog/page.tsx` |
| Create | `app/news/page.tsx` |
| Create | `app/profile/page.tsx` |
| Modify | `components/PageTransitionWrapper.tsx` |
| Modify | `components/TopNav.tsx` |
| Modify | `components/SuggestedQuestions.tsx` |
| Modify | `app/page.tsx` |
| Modify | `components/FloatingInput.tsx` |
| Modify | `components/BottomSheet.tsx` |

---

### Task 1: Create stub pages (catalog, news, profile)

**Files:**
- Create: `app/catalog/page.tsx`
- Create: `app/news/page.tsx`
- Create: `app/profile/page.tsx`

- [ ] **Step 1: Create catalog page**

```tsx
// app/catalog/page.tsx
export default function CatalogPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Catalog</h1>
      <p className="text-neutral-400 text-sm">Full product catalog coming soon.</p>
    </div>
  );
}
```

- [ ] **Step 2: Create news page**

```tsx
// app/news/page.tsx
export default function NewsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">News</h1>
      <p className="text-neutral-400 text-sm">Industry news and updates coming soon.</p>
    </div>
  );
}
```

- [ ] **Step 3: Create profile page (gear icon triggers settings sheet)**

```tsx
// app/profile/page.tsx
"use client";

import { Settings } from "lucide-react";
import { useUIState } from "@/components/UIStateProvider";

export default function ProfilePage() {
  const { setOpenSheet } = useUIState();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <button
          onClick={() => setOpenSheet("settings")}
          className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
          aria-label="Open settings"
        >
          <Settings size={18} className="text-neutral-300" />
        </button>
      </div>
      <p className="text-neutral-400 text-sm">Profile management coming soon.</p>
    </div>
  );
}
```

- [ ] **Step 4: Verify dev server shows pages without errors**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/catalog`
Expected: `200` (or check via browser if server is running)

- [ ] **Step 5: Commit**

```bash
git add app/catalog/page.tsx app/news/page.tsx app/profile/page.tsx
git commit -m "feat: add stub pages for catalog, news, and profile routes"
```

---

### Task 2: Responsive PageTransitionWrapper

**Files:**
- Modify: `components/PageTransitionWrapper.tsx`

Context: Currently `/profile` slides from left, `/news` slides from right, and default routes fade+slide vertically. On desktop (md: 768px+) all routes should simply fade in (no x/y translation).

- [ ] **Step 1: Update PageTransitionWrapper with responsive variants**

Replace the entire file:

```tsx
// components/PageTransitionWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

function getVariants(pathname: string, isDesktop: boolean) {
  if (isDesktop) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  if (pathname === "/profile") {
    return {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 40 },
    };
  }
  if (pathname === "/news") {
    return {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -40 },
    };
  }
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };
}

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const variants = getVariants(pathname, isDesktop);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="pt-14 pb-32 min-h-dvh"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PageTransitionWrapper.tsx
git commit -m "feat: responsive page transitions — fade-only on desktop, slide on mobile"
```

---

### Task 3: TopNav — Profile routes to /profile, desktop edge layout

**Files:**
- Modify: `components/TopNav.tsx`

Changes:
1. Profile button → `router.push("/profile")` (currently opens settings sheet)
2. On desktop (md:), use absolute positioning so Profile is at the far left edge and News at the far right edge, keeping center pill centered
3. On mobile, keep current flex row layout

- [ ] **Step 1: Update TopNav**

Replace the entire file:

```tsx
// components/TopNav.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { UserCircle, Newspaper, MessageCircle, Grid2x2 } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isChatActive = pathname === "/";
  const isCatalogActive = pathname === "/catalog";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-neutral-950/80 backdrop-blur-sm border-b border-white/5">
      <div className="relative flex items-center justify-between h-full w-full max-w-2xl mx-auto px-4 md:max-w-none md:justify-center">
        {/* Profile — routes to /profile page */}
        <button
          onClick={() => router.push("/profile")}
          className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors md:absolute md:left-4"
          aria-label="Profile"
        >
          <UserCircle size={18} className="text-neutral-300" />
        </button>

        {/* Center: Chat / Catalog toggle */}
        <div className="bg-neutral-800/60 rounded-full p-1 flex gap-1">
          <button
            onClick={() => router.push("/")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isChatActive ? "bg-neutral-700 text-white" : "text-neutral-400"
            }`}
          >
            <MessageCircle size={14} />
            Chat
          </button>
          <button
            onClick={() => router.push("/catalog")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isCatalogActive ? "bg-neutral-700 text-white" : "text-neutral-400"
            }`}
          >
            <Grid2x2 size={14} />
            Catalog
          </button>
        </div>

        {/* News — far right on desktop */}
        <button
          onClick={() => router.push("/news")}
          className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors md:absolute md:right-4"
          aria-label="News"
        >
          <Newspaper size={18} className="text-neutral-300" />
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/TopNav.tsx
git commit -m "feat: TopNav profile routes to /profile, desktop buttons at screen edges"
```

---

### Task 4: SuggestedQuestions 2×2 grid + shrink home screen hero

**Files:**
- Modify: `components/SuggestedQuestions.tsx`
- Modify: `app/page.tsx`

Changes:
- Reduce suggestions to 4 items
- Force 2-column grid at all viewport sizes
- Shrink CrownLogo from 157→120 (desktop) / 105→80 (mobile)
- Reduce welcome heading from `text-xl sm:text-2xl` to `text-lg sm:text-xl`

- [ ] **Step 1: Update SuggestedQuestions to 4 items in 2×2 grid**

Replace the entire file:

```tsx
// components/SuggestedQuestions.tsx
"use client";

const suggestions = [
  "Colors for Norwegian Fluted siding?",
  "Price on 16ft Belgian Fluted boards?",
  "Do you carry ROCKWOOL insulation?",
  "Which Crown locations are in Alberta?",
];

interface Props {
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-crown-gold/70 text-center mb-2">
        Try asking
      </p>
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        {suggestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="text-left text-sm font-medium px-3 py-2.5 sm:px-4 sm:py-3
                       rounded-lg border border-crown-gold/25 border-l-[3px] border-l-crown-gold
                       bg-neutral-900 hover:bg-neutral-800 hover:border-crown-gold/50
                       transition-all duration-150 text-neutral-200"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Shrink hero section in app/page.tsx**

In `app/page.tsx`, find the hero section and apply these changes:

```tsx
// app/page.tsx — replace the entire file
"use client";

import { useRef, useEffect } from "react";
import { useChatContext } from "@/components/ChatProvider";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import CrownLogo from "@/components/CrownLogo";

export default function Home() {
  const { messages, isLoading, append } = useChatContext();
  const mainRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;
  const showTypingIndicator =
    isLoading && messages[messages.length - 1]?.role === "user";

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={mainRef}
      className="overflow-y-auto chat-scroll h-[calc(100dvh-152px)]"
    >
      <div className="max-w-2xl mx-auto px-4 py-3 sm:py-6">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 sm:gap-5">
            <div className="flex flex-col items-center gap-2">
              <CrownLogo size={120} className="w-[80px] sm:w-[120px] h-auto" />
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-crown-gold">
                Crown Building Supplies
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Welcome to Crown AI
              </h2>
              <p className="text-sm text-neutral-400 text-center max-w-sm">
                Your intelligent product assistant for pricing, specs, colors,
                and availability.
              </p>
            </div>
            <SuggestedQuestions
              onSelect={(q) => append({ role: "user", content: q })}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {showTypingIndicator && <TypingIndicator />}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/SuggestedQuestions.tsx app/page.tsx
git commit -m "feat: 2x2 suggested questions grid, smaller hero logo and heading"
```

---

### Task 5: FloatingInput — unified action button

**Files:**
- Modify: `components/FloatingInput.tsx`

Changes:
1. Remove the standalone speech/mic button
2. The single action button handles both mic and send based on state:
   - **Default** (no text, not listening): `bg-neutral-700`, gray mic SVG
   - **isListening**: `bg-crown-gold`, 4 animated vertical black bars (Framer Motion)
   - **hasText**: `bg-crown-gold`, black upward-arrow SVG
3. Textarea: add `min-h-[40px]`, keep no border (already transparent)
4. Layout row: `[Pill] [Textarea] [ActionButton]` — all in one flex row (remove the separate toolbar row)

Note: The toolbar pill and textarea are now in the same horizontal row. The `flex-col gap-2` wrapper becomes a single `flex` row with the pill, textarea, and button.

- [ ] **Step 1: Rewrite FloatingInput**

Replace the entire file:

```tsx
// components/FloatingInput.tsx
"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useChatContext } from "./ChatProvider";
import { useUIState } from "./UIStateProvider";
import { BottomSheet } from "./BottomSheet";
import { SheetCatalogSelector } from "./SheetCatalogSelector";
import { SheetSettings } from "./SheetSettings";

function SoundWaveBars() {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-black rounded-full"
          style={{ height: "4px" }}
          animate={{ height: ["4px", "12px", "6px", "14px", "4px"] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

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

  const actionBg =
    hasText || isListening ? "bg-crown-gold hover:bg-crown-gold-dark" : "bg-neutral-700 hover:bg-neutral-600";

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
        <div className="bg-neutral-800/80 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 shadow-2xl">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex items-end gap-2"
          >
            {/* Context pill */}
            <button
              type="button"
              onClick={() => setOpenSheet("catalog")}
              className="flex-shrink-0 self-end mb-[5px] bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-xs rounded-full px-3 py-1 font-medium transition-colors"
            >
              {selectedSource}
            </button>

            {/* Textarea */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              style={{ minHeight: "40px" }}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-white placeholder:text-neutral-500 py-2"
              disabled={isLoading}
            />

            {/* Unified action button */}
            <motion.button
              type="button"
              onClick={handleActionClick}
              disabled={isLoading && !hasText}
              animate={{ scale: isLoading ? [1, 1.12, 1] : 1 }}
              transition={{ repeat: isLoading ? Infinity : 0, duration: 0.9 }}
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:pointer-events-none ${actionBg}`}
              aria-label={hasText ? "Send message" : isListening ? "Stop recording" : "Start voice input"}
            >
              {isListening ? (
                <SoundWaveBars />
              ) : hasText ? (
                /* Upward arrow / Send */
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              ) : (
                /* Mic */
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
          </form>
        </div>
      </div>

      {/* Settings Sheet (90vh) */}
      <BottomSheet
        isOpen={openSheet === "settings"}
        onClose={() => setOpenSheet(null)}
        heightClass="h-[90vh]"
      >
        <SheetSettings onClose={() => setOpenSheet(null)} />
      </BottomSheet>

      {/* Catalog Sheet (2/3 height) */}
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
```

- [ ] **Step 2: Commit**

```bash
git add components/FloatingInput.tsx
git commit -m "feat: unified action button — mic default, sound-wave bars on listening, send arrow on text"
```

---

### Task 6: BottomSheet — constrain content width on desktop

**Files:**
- Modify: `components/BottomSheet.tsx`

The sheet panel already uses `left-0 right-0` so it stretches full-width on desktop. Wrap children in `max-w-2xl mx-auto` so content doesn't span the full viewport width.

- [ ] **Step 1: Add max-w-2xl wrapper around children**

Replace the entire file:

```tsx
// components/BottomSheet.tsx
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
            <div className="max-w-2xl mx-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/BottomSheet.tsx
git commit -m "feat: constrain BottomSheet content to max-w-2xl on desktop"
```

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|---|---|
| Create app/catalog/page.tsx | Task 1 ✅ |
| Create app/news/page.tsx | Task 1 ✅ |
| Create app/profile/page.tsx | Task 1 ✅ |
| Mobile: /profile slides left, /news slides right | Task 2 ✅ |
| Desktop (md:): all routes fade only | Task 2 ✅ |
| TopNav Profile routes to /profile | Task 3 ✅ |
| Desktop: Profile far left, News far right | Task 3 ✅ |
| 4 suggested questions in 2×2 grid | Task 4 ✅ |
| Shrink CrownLogo + welcome text | Task 4 ✅ |
| Remove redundant sound-wave icon | Task 5 ✅ |
| Layout: [Context Pill] [Textarea] [Action Button] | Task 5 ✅ |
| Action button: dark + gray mic (default) | Task 5 ✅ |
| Action button: crown-gold + animated bars (listening) | Task 5 ✅ |
| Action button: crown-gold + black send arrow (hasText) | Task 5 ✅ |
| Textarea min-h-[40px], no bulky borders | Task 5 ✅ |
| BottomSheet max-w-2xl content constraint | Task 6 ✅ |
| Profile page gear icon → opens SheetSettings | Task 1 ✅ |

**Placeholder scan:** No TBDs, TODOs, or "similar to" references. All code blocks are complete.

**Type consistency:** `toggleListening`, `isSpeechSupported`, `isListening` — all sourced from `useChatContext()` which already exposes them in `ChatProvider.tsx`. `setOpenSheet` from `useUIState()`. All consistent.
