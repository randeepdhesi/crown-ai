# Phase 2: Perplexity-Style UI Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Crown AI into a minimalist dark-mode PWA with Framer Motion transitions, persistent floating input, a two-context architecture (ChatProvider + UIStateProvider), and Perplexity-style bottom sheets and navigation.

**Architecture:** `ChatProvider` lifts `useChat` + voice state to context so `FloatingInput` and `page.tsx` share the same stream without prop-drilling. A second `UIStateProvider` manages which bottom sheet is open, shared between `TopNav` (triggers Settings sheet) and `FloatingInput` (triggers Catalog sheet). `PageTransitionWrapper` wraps pages in `AnimatePresence` keyed on `usePathname()`. All layout chrome (TopNav + FloatingInput) lives in `layout.tsx` as persistent fixed UI.

**Tech Stack:** Next.js 14 App Router, framer-motion, next-themes, lucide-react, ai/react (useChat), Tailwind CSS (dark mode via `darkMode: 'class'`)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `components/ChatProvider.tsx` | `useChat` + voice state exposed via React context |
| Create | `components/UIStateProvider.tsx` | Sheet open state + selected catalog source |
| Create | `components/PageTransitionWrapper.tsx` | `AnimatePresence` keyed on pathname |
| Create | `components/TopNav.tsx` | Fixed header: profile btn, mode toggle, news btn |
| Create | `components/FloatingInput.tsx` | Floating textarea + Catalog pill + renders both sheets |
| Create | `components/BottomSheet.tsx` | Reusable Framer spring-physics sheet |
| Create | `components/SheetSettings.tsx` | Settings sheet content (90vh) |
| Create | `components/SheetCatalogSelector.tsx` | Data source picker (h-2/3) |
| Create | `app/catalog/page.tsx` | Dummy skeleton grid — 3×3 dark cards |
| Create | `app/profile/page.tsx` | Dummy Threads page |
| Create | `app/news/page.tsx` | Dummy Industry News page |
| Create | `__tests__/UIStateProvider.test.tsx` | Unit tests for sheet state logic |
| Create | `__tests__/ChatProvider.test.tsx` | Unit tests for context shape + error guard |
| Create | `__tests__/BottomSheet.test.tsx` | Render tests for open/close behaviour |
| Create | `jest.config.ts` | Jest + next/jest config |
| Create | `jest.setup.ts` | @testing-library/jest-dom import |
| Modify | `app/layout.tsx` | Wire all providers + persistent UI |
| Modify | `app/page.tsx` | Strip to context-only chat view |
| Modify | `app/globals.css` | Dark theme: #121212 body, dark table/code |
| Modify | `tailwind.config.ts` | Add `darkMode: 'class'` |
| Modify | `components/ChatMessage.tsx` | Dark-mode bubble + ProductCard colours |
| Modify | `components/SuggestedQuestions.tsx` | Dark-mode button colours |
| Modify | `package.json` (via npm) | Add framer-motion, next-themes, test deps |

---

## Task 1: Install runtime and dev dependencies

**Files:** `package.json`, `package-lock.json`

- [ ] **Step 1: Install runtime packages**

```bash
npm install framer-motion next-themes
```

Expected: `framer-motion` and `next-themes` appear in `dependencies` in `package.json`.

- [ ] **Step 2: Install test packages**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest
```

Expected: all five packages appear in `devDependencies`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion, next-themes, jest + RTL test deps"
```

---

## Task 2: Dark theme foundation

**Files:** `tailwind.config.ts`, `app/globals.css`

- [ ] **Step 1: Enable Tailwind dark mode and verify crown palette unchanged**

Replace `tailwind.config.ts` completely:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crown: {
          gold: "#b3874b",
          "gold-light": "#c9a06a",
          "gold-dark": "#96703d",
          charcoal: "#1a1a1a",
          "charcoal-light": "#2d2d2d",
          slate: "#f5f3f0",
          "slate-dark": "#e8e4df",
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Replace globals.css with dark-mode stylesheet**

Replace `app/globals.css` completely:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --crown-gold: #b3874b;
  --crown-gold-light: #c9a06a;
  --crown-charcoal: #1a1a1a;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #121212;
  color: #ffffff;
}

/* Custom scrollbar */
.chat-scroll::-webkit-scrollbar {
  width: 6px;
}
.chat-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.chat-scroll::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 3px;
}
.chat-scroll::-webkit-scrollbar-thumb:hover {
  background: #b3874b;
}

/* Markdown styling in messages */
.message-content p {
  margin-bottom: 0.5rem;
}
.message-content p:last-child {
  margin-bottom: 0;
}
.message-content ul,
.message-content ol {
  margin: 0.5rem 0;
  padding-left: 1.25rem;
}
.message-content li {
  margin-bottom: 0.25rem;
}
.message-content strong {
  font-weight: 600;
}
.message-content code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  font-size: 0.875em;
}
.message-content table {
  border-collapse: collapse;
  margin: 0.75rem 0;
  width: 100%;
  font-size: 0.85em;
}
.message-content .table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0.75rem 0;
  border-radius: 6px;
}
.message-content .table-wrapper table {
  margin: 0;
  min-width: 400px;
}
.message-content th,
.message-content td {
  border: 1px solid #404040;
  padding: 0.4rem 0.6rem;
  text-align: left;
  white-space: nowrap;
}
.message-content th {
  background: #262626;
  font-weight: 600;
  color: #ffffff;
}
.message-content tr:nth-child(even) {
  background: #1a1a1a;
}

/* Typing indicator */
@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}
.typing-dot {
  animation: blink 1.4s infinite both;
}
.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* Fade in animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeInUp 0.3s ease-out;
}

/* Input glow on focus */
.input-glow:focus-within {
  box-shadow: 0 0 0 2px rgba(179, 135, 75, 0.3);
}

/* Dark chat background */
.chat-bg {
  background: #121212;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: apply dark theme foundation (#121212 body, dark tables/code)"
```

---

## Task 3: Set up Jest test infrastructure

**Files:** `jest.config.ts`, `jest.setup.ts`

- [ ] **Step 1: Create jest.config.ts**

```ts
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
```

- [ ] **Step 2: Create jest.setup.ts**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

The full `scripts` block becomes:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

- [ ] **Step 4: Verify Jest runs (no tests yet)**

```bash
npm test -- --passWithNoTests
```

Expected: `Test Suites: 0 passed` with exit code 0.

- [ ] **Step 5: Commit**

```bash
git add jest.config.ts jest.setup.ts package.json package-lock.json
git commit -m "chore: configure Jest with next/jest and React Testing Library"
```

---

## Task 4: Create UIStateProvider

**Files:** `components/UIStateProvider.tsx`, `__tests__/UIStateProvider.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/UIStateProvider.test.tsx`:

```tsx
import { renderHook, act } from "@testing-library/react";
import { UIStateProvider, useUIState } from "@/components/UIStateProvider";

describe("UIStateProvider", () => {
  it("provides null openSheet and 'All Inventory' source by default", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    expect(result.current.openSheet).toBeNull();
    expect(result.current.selectedSource).toBe("All Inventory");
  });

  it("updates openSheet to 'settings'", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    act(() => { result.current.setOpenSheet("settings"); });
    expect(result.current.openSheet).toBe("settings");
  });

  it("updates openSheet to 'catalog'", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    act(() => { result.current.setOpenSheet("catalog"); });
    expect(result.current.openSheet).toBe("catalog");
  });

  it("clears openSheet to null", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    act(() => { result.current.setOpenSheet("settings"); });
    act(() => { result.current.setOpenSheet(null); });
    expect(result.current.openSheet).toBeNull();
  });

  it("updates selectedSource", () => {
    const { result } = renderHook(() => useUIState(), { wrapper: UIStateProvider });
    act(() => { result.current.setSelectedSource("CGC Drywall"); });
    expect(result.current.selectedSource).toBe("CGC Drywall");
  });

  it("throws when used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderHook(() => useUIState());
    }).toThrow("useUIState must be used within UIStateProvider");
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- UIStateProvider
```

Expected: FAIL — `Cannot find module '@/components/UIStateProvider'`

- [ ] **Step 3: Create UIStateProvider.tsx**

Create `components/UIStateProvider.tsx`:

```tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SheetType = "settings" | "catalog" | null;

interface UIStateContextValue {
  openSheet: SheetType;
  setOpenSheet: (sheet: SheetType) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
}

const UIStateContext = createContext<UIStateContextValue | null>(null);

export function useUIState() {
  const ctx = useContext(UIStateContext);
  if (!ctx) throw new Error("useUIState must be used within UIStateProvider");
  return ctx;
}

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [openSheet, setOpenSheet] = useState<SheetType>(null);
  const [selectedSource, setSelectedSource] = useState("All Inventory");

  return (
    <UIStateContext.Provider value={{ openSheet, setOpenSheet, selectedSource, setSelectedSource }}>
      {children}
    </UIStateContext.Provider>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- UIStateProvider
```

Expected: PASS — 6 tests

- [ ] **Step 5: Commit**

```bash
git add components/UIStateProvider.tsx __tests__/UIStateProvider.test.tsx
git commit -m "feat: add UIStateProvider for sheet open state and catalog source"
```

---

## Task 5: Create ChatProvider

**Files:** `components/ChatProvider.tsx`, `__tests__/ChatProvider.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/ChatProvider.test.tsx`:

```tsx
import { renderHook } from "@testing-library/react";
import { ChatProvider, useChatContext } from "@/components/ChatProvider";

jest.mock("ai/react", () => ({
  useChat: () => ({
    messages: [],
    input: "",
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    append: jest.fn(),
    setMessages: jest.fn(),
    setInput: jest.fn(),
  }),
}));

describe("ChatProvider", () => {
  it("exposes all required context values", () => {
    const { result } = renderHook(() => useChatContext(), { wrapper: ChatProvider });
    expect(result.current.messages).toEqual([]);
    expect(typeof result.current.input).toBe("string");
    expect(typeof result.current.handleSubmit).toBe("function");
    expect(typeof result.current.handleInputChange).toBe("function");
    expect(typeof result.current.append).toBe("function");
    expect(typeof result.current.setMessages).toBe("function");
    expect(typeof result.current.setInput).toBe("function");
    expect(typeof result.current.toggleListening).toBe("function");
    expect(typeof result.current.isSpeechSupported).toBe("boolean");
    expect(typeof result.current.isListening).toBe("boolean");
  });

  it("isSpeechSupported is false in jsdom (no SpeechRecognition)", () => {
    const { result } = renderHook(() => useChatContext(), { wrapper: ChatProvider });
    expect(result.current.isSpeechSupported).toBe(false);
  });

  it("throws when used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderHook(() => useChatContext());
    }).toThrow("useChatContext must be used within ChatProvider");
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- ChatProvider
```

Expected: FAIL — `Cannot find module '@/components/ChatProvider'`

- [ ] **Step 3: Create ChatProvider.tsx**

Create `components/ChatProvider.tsx`:

```tsx
"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useChat } from "ai/react";
import type { Message } from "ai";

interface ChatContextValue {
  messages: Message[];
  input: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  append: (message: { role: "user"; content: string }) => void;
  setMessages: (messages: Message[]) => void;
  setInput: (input: string) => void;
  isListening: boolean;
  toggleListening: () => void;
  isSpeechSupported: boolean;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    setMessages,
    setInput,
  } = useChat({ api: "/api/chat" });

  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const inputValueRef = useRef(input);

  useEffect(() => {
    inputValueRef.current = input;
  }, [input]);

  useEffect(() => {
    setIsSpeechSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      const current = inputValueRef.current;
      setInput(current ? current + " " + transcript : transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, setInput]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setInput("");
  }, [setMessages, setInput]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        append,
        setMessages,
        setInput,
        isListening,
        toggleListening,
        isSpeechSupported,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- ChatProvider
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add components/ChatProvider.tsx __tests__/ChatProvider.test.tsx
git commit -m "feat: add ChatProvider lifting useChat and voice state to context"
```

---

## Task 6: Create PageTransitionWrapper

**Files:** `components/PageTransitionWrapper.tsx`

- [ ] **Step 1: Create PageTransitionWrapper.tsx**

Create `components/PageTransitionWrapper.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

function getVariants(pathname: string) {
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
  const variants = getVariants(pathname);

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
git commit -m "feat: add PageTransitionWrapper with route-aware Framer transitions"
```

---

## Task 7: Create BottomSheet

**Files:** `components/BottomSheet.tsx`, `__tests__/BottomSheet.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/BottomSheet.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { BottomSheet } from "@/components/BottomSheet";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, onClick, className }: React.HTMLAttributes<HTMLDivElement>) => (
      <div onClick={onClick} className={className}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("BottomSheet", () => {
  it("renders children when isOpen is true", () => {
    render(
      <BottomSheet isOpen={true} onClose={jest.fn()} heightClass="h-2/3">
        <span>Sheet content</span>
      </BottomSheet>
    );
    expect(screen.getByText("Sheet content")).toBeInTheDocument();
  });

  it("does not render children when isOpen is false", () => {
    render(
      <BottomSheet isOpen={false} onClose={jest.fn()} heightClass="h-2/3">
        <span>Sheet content</span>
      </BottomSheet>
    );
    expect(screen.queryByText("Sheet content")).not.toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = jest.fn();
    render(
      <BottomSheet isOpen={true} onClose={onClose} heightClass="h-2/3">
        <span>Content</span>
      </BottomSheet>
    );
    fireEvent.click(screen.getByTestId("sheet-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- BottomSheet
```

Expected: FAIL — `Cannot find module '@/components/BottomSheet'`

- [ ] **Step 3: Create BottomSheet.tsx**

Create `components/BottomSheet.tsx`:

```tsx
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
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- BottomSheet
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add components/BottomSheet.tsx __tests__/BottomSheet.test.tsx
git commit -m "feat: add reusable BottomSheet with Framer spring animation"
```

---

## Task 8: Create SheetCatalogSelector

**Files:** `components/SheetCatalogSelector.tsx`

- [ ] **Step 1: Create SheetCatalogSelector.tsx**

Create `components/SheetCatalogSelector.tsx`:

```tsx
"use client";

import { Package, FileText, Layers, Lock, Check } from "lucide-react";
import { useUIState } from "./UIStateProvider";

const SOURCES = [
  { id: "all", label: "All Inventory", Icon: Package, locked: false },
  { id: "newtech", label: "NewTechWood Specs", Icon: FileText, locked: true },
  { id: "cgc", label: "CGC Drywall", Icon: FileText, locked: true },
  { id: "rockwool", label: "ROCKWOOL Guides", Icon: Layers, locked: true },
] as const;

export function SheetCatalogSelector({ onClose }: { onClose: () => void }) {
  const { selectedSource, setSelectedSource } = useUIState();

  return (
    <div className="px-4 pb-8">
      <p className="text-white font-semibold text-base mb-4">Data Source</p>
      <div className="flex flex-col gap-2">
        {SOURCES.map(({ id, label, Icon, locked }) => {
          const isActive = selectedSource === label;
          return (
            <button
              key={id}
              disabled={locked}
              onClick={() => {
                if (!locked) {
                  setSelectedSource(label);
                  onClose();
                }
              }}
              className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left"
            >
              <Icon
                size={18}
                className={isActive ? "text-crown-gold" : "text-neutral-400"}
              />
              <span
                className={`flex-1 text-sm font-medium ${
                  isActive
                    ? "text-crown-gold"
                    : locked
                    ? "text-neutral-500"
                    : "text-white"
                }`}
              >
                {label}
              </span>
              {locked ? (
                <Lock size={14} className="text-neutral-500" />
              ) : isActive ? (
                <Check size={14} className="text-crown-gold" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SheetCatalogSelector.tsx
git commit -m "feat: add SheetCatalogSelector with 4 data source rows"
```

---

## Task 9: Create SheetSettings

**Files:** `components/SheetSettings.tsx`

- [ ] **Step 1: Create SheetSettings.tsx**

Create `components/SheetSettings.tsx`:

```tsx
"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIState } from "./UIStateProvider";

export function SheetSettings({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { setOpenSheet } = useUIState();

  function navigateToProfile() {
    setOpenSheet(null);
    router.push("/profile");
  }

  return (
    <div className="px-4 pb-8">
      <p className="text-white font-semibold text-base mb-6">Settings</p>

      {/* Account section */}
      <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold mb-2">
        Account
      </p>
      <button
        onClick={navigateToProfile}
        className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left mb-6"
      >
        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">R</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium">Randeep Dhesi</p>
          <p className="text-neutral-400 text-xs">randeep@buildmapper.com</p>
        </div>
        <ChevronRight size={16} className="text-neutral-400 flex-shrink-0" />
      </button>

      {/* Preferences section */}
      <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold mb-2">
        Preferences
      </p>
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Notifications</p>
            <p className="text-neutral-400 text-xs">Manage alerts</p>
          </div>
          {/* Static toggle indicator — no real state wired */}
          <div className="w-10 h-6 bg-neutral-600 rounded-full relative flex-shrink-0">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1" />
          </div>
        </div>
        <button className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Language</p>
            <p className="text-neutral-400 text-xs">English</p>
          </div>
          <ChevronRight size={16} className="text-neutral-400 flex-shrink-0" />
        </button>
      </div>

      {/* Danger section */}
      <button className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left">
        <span className="text-red-500 text-sm font-medium">Log Out</span>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SheetSettings.tsx
git commit -m "feat: add SheetSettings with account, preferences, and log out rows"
```

---

## Task 10: Create TopNav

**Files:** `components/TopNav.tsx`

- [ ] **Step 1: Create TopNav.tsx**

Create `components/TopNav.tsx`:

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { UserCircle, Newspaper, MessageCircle, Grid2x2 } from "lucide-react";
import { useUIState } from "./UIStateProvider";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenSheet } = useUIState();

  const isChatActive = pathname === "/";
  const isCatalogActive = pathname === "/catalog";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-neutral-950/80 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center justify-between h-full w-full max-w-2xl mx-auto px-4">
        {/* Left: Profile → opens Settings sheet */}
        <button
          onClick={() => setOpenSheet("settings")}
          className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center"
          aria-label="Settings"
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

        {/* Right: News */}
        <button
          onClick={() => router.push("/news")}
          className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center"
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
git commit -m "feat: add TopNav with profile, mode toggle, and news buttons"
```

---

## Task 11: Create FloatingInput

**Files:** `components/FloatingInput.tsx`

- [ ] **Step 1: Create FloatingInput.tsx**

Create `components/FloatingInput.tsx`:

```tsx
"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useChatContext } from "./ChatProvider";
import { useUIState } from "./UIStateProvider";
import { BottomSheet } from "./BottomSheet";
import { SheetCatalogSelector } from "./SheetCatalogSelector";
import { SheetSettings } from "./SheetSettings";

const pulseTransition = {
  animate: { scale: [1, 1.12, 1] as number[] },
  transition: { repeat: Infinity, duration: 0.9 },
};

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
                {...(isListening ? pulseTransition : {})}
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
              {...(isLoading ? pulseTransition : {})}
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
```

- [ ] **Step 2: Commit**

```bash
git add components/FloatingInput.tsx
git commit -m "feat: add FloatingInput with Catalog pill, pulsing buttons, and sheet renders"
```

---

## Task 12: Update layout.tsx

**Files:** `app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx**

Replace `app/layout.tsx` completely:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/components/ChatProvider";
import { UIStateProvider } from "@/components/UIStateProvider";
import { TopNav } from "@/components/TopNav";
import { FloatingInput } from "@/components/FloatingInput";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

export const metadata: Metadata = {
  title: "Crown AI — Crown Building Supplies",
  description:
    "Your intelligent building supplies assistant. Ask about products, pricing, specs, and more.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950">
        <ChatProvider>
          <UIStateProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              <TopNav />
              <PageTransitionWrapper>{children}</PageTransitionWrapper>
              <FloatingInput />
            </ThemeProvider>
          </UIStateProvider>
        </ChatProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wire providers, TopNav, FloatingInput, and PageTransitionWrapper in layout"
```

---

## Task 13: Update app/page.tsx (chat view)

**Files:** `app/page.tsx`

Replace the entire file. The old `useChat` call, voice logic, header, and footer are gone — they all live in providers and layout chrome now.

- [ ] **Step 1: Replace page.tsx**

```tsx
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <CrownLogo size={157} className="w-[105px] sm:w-[157px] h-auto" />
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-crown-gold">
                Crown Building Supplies
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Welcome to Crown AI
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 text-center max-w-sm">
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

> `h-[calc(100dvh-152px)]`: 56px TopNav + 96px FloatingInput area (bottom-6 24px + ~72px input height). Adjust ±8px in browser if the scroll container clips content.

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: refactor chat page to use ChatContext, remove old header/footer"
```

---

## Task 14: Dark-adapt ChatMessage and SuggestedQuestions

**Files:** `components/ChatMessage.tsx`, `components/SuggestedQuestions.tsx`

- [ ] **Step 1: Update ChatMessage.tsx**

The changes are targeted: user bubble, AI bubble, and ProductCard backgrounds only. Replace the `ChatMessage` export and `ProductCard` function:

In `components/ChatMessage.tsx`, update `ProductCard`:

```tsx
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3 bg-neutral-800 rounded-md border-l-[3px] border-crown-gold shadow-sm px-3 py-2.5">
      <div className="flex-shrink-0 w-12 h-12 rounded bg-neutral-700 flex items-center justify-center">
        <Package size={20} className="text-neutral-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{product.name}</p>
        <p className="text-sm font-semibold text-crown-gold">${product.price.toFixed(2)} CAD</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              product.inStock ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
          <span className="text-xs text-neutral-400">
            {product.inStock ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
      <button className="flex-shrink-0 text-xs font-medium text-crown-gold border border-crown-gold/40 rounded px-2.5 py-1.5 hover:bg-crown-gold/5 transition-colors whitespace-nowrap">
        View Specs
      </button>
    </div>
  );
}
```

Update the message bubble `div` className inside `ChatMessage` export:

```tsx
<div
  className={`max-w-[90%] rounded-2xl px-5 py-4 ${
    isUser
      ? "bg-neutral-800 text-white rounded-tr-md"
      : "bg-neutral-900 text-neutral-100 shadow-sm border-l-[3px] border-crown-gold rounded-tl-md"
  }`}
>
```

Update the user avatar `div`:

```tsx
<div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
```

- [ ] **Step 2: Update SuggestedQuestions.tsx**

Replace the button className in `SuggestedQuestions.tsx`:

```tsx
className="text-left text-sm font-medium px-3 py-2.5 sm:px-4 sm:py-3
           rounded-lg border border-crown-gold/25 border-l-[3px] border-l-crown-gold
           bg-neutral-900 hover:bg-neutral-800 hover:border-crown-gold/50
           transition-all duration-150 text-neutral-200"
```

- [ ] **Step 3: Commit**

```bash
git add components/ChatMessage.tsx components/SuggestedQuestions.tsx
git commit -m "feat: dark-mode adapt ChatMessage bubbles, ProductCard, and SuggestedQuestions"
```

---

## Task 15: Create dummy routes

**Files:** `app/catalog/page.tsx`, `app/profile/page.tsx`, `app/news/page.tsx`

- [ ] **Step 1: Create app/catalog/page.tsx**

```tsx
export default function CatalogPage() {
  return (
    <div className="px-4">
      <h1 className="text-white font-bold text-xl mb-6">Catalog</h1>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-800 animate-pulse rounded-xl h-32"
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create app/profile/page.tsx**

```tsx
export default function ProfilePage() {
  const threads = [
    "What colors does Norwegian Fluted come in?",
    "Price on 16ft Belgian Fluted boards",
    "ROCKWOOL insulation availability in Alberta",
  ];

  return (
    <div className="px-4">
      <h1 className="text-white font-bold text-xl mb-6">Threads</h1>
      <div className="flex flex-col gap-2">
        {threads.map((thread, i) => (
          <div
            key={i}
            className="bg-neutral-900 rounded-xl px-4 py-3"
          >
            <p className="text-neutral-200 text-sm">{thread}</p>
            <p className="text-neutral-500 text-xs mt-1">Today</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create app/news/page.tsx**

```tsx
export default function NewsPage() {
  const articles = [
    {
      title: "NewTechWood Launches Brushed Composite Line",
      date: "Apr 16, 2026",
      summary: "New brushed finish available in 6 colourways for exterior cladding.",
    },
    {
      title: "CGC Introduces Moisture-Resistant Drywall",
      date: "Apr 14, 2026",
      summary: "Ideal for high-humidity environments; available in 4x8 and 4x12 sheets.",
    },
    {
      title: "ROCKWOOL Expands Canadian Distribution",
      date: "Apr 10, 2026",
      summary: "New warehouse in Calgary reduces lead times for Prairie orders.",
    },
  ];

  return (
    <div className="px-4">
      <h1 className="text-white font-bold text-xl mb-6">Industry News</h1>
      <div className="flex flex-col gap-3">
        {articles.map((a, i) => (
          <div key={i} className="bg-neutral-900 rounded-xl px-4 py-4">
            <p className="text-white text-sm font-semibold">{a.title}</p>
            <p className="text-neutral-500 text-xs mt-0.5">{a.date}</p>
            <p className="text-neutral-400 text-sm mt-1.5">{a.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/catalog/page.tsx app/profile/page.tsx app/news/page.tsx
git commit -m "feat: add dummy catalog, profile (Threads), and news pages"
```

---

## Task 16: Run all tests and manual smoke test

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass (UIStateProvider: 6, ChatProvider: 3, BottomSheet: 3 = 12 total).

- [ ] **Step 2: Start dev server**

```bash
npm run dev
```

- [ ] **Step 3: Manual verification checklist**

Open `http://localhost:3000` and verify:

1. **Dark background** — body is `#121212`, no white flash
2. **TopNav** — fixed at top, profile icon left, Chat/Catalog toggle center, News icon right
3. **FloatingInput** — floats above bottom, "All Inventory" pill visible, textarea placeholder reads "Ask about products, specs..."
4. **Chat mode toggle** — click "Catalog" in TopNav → skeleton grid appears, placeholder morphs to "Search the full catalog...", Catalog tab highlights
5. **Profile button** → Settings sheet slides up from bottom (90vh), shows Account / Preferences / Log Out
6. **Account row chevron** in Settings sheet → closes sheet, navigates to `/profile` with left-slide transition
7. **News button** → `/news` with right-slide transition
8. **Back to Chat** — click Chat in TopNav → chat view with upward-fade transition
9. **Catalog pill** in FloatingInput → Catalog Selector sheet slides up (h-2/3), shows 4 data source rows with lock icons
10. **Select "All Inventory"** → sheet closes, pill label unchanged (already selected)
11. **Backdrop click** on any open sheet → sheet springs closed
12. **Send a chat message** — typing indicator appears, AI response renders in dark bubble with gold left border
13. **ProductCard** (if returned by tool call) — dark `bg-neutral-800` background

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: Phase 2 complete — Perplexity-style dark UI with Framer Motion"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ framer-motion + next-themes installed (Task 1)
- ✅ ThemeProvider with dark default (Task 12)
- ✅ globals.css dark body #121212 (Task 2)
- ✅ TopNav: profile circle, mode toggle pill, news circle (Task 10)
- ✅ FloatingInput: dark pill, Catalog context button, pulsing Framer buttons (Task 11)
- ✅ BottomSheet reusable with spring physics (Task 7)
- ✅ Sheet A (Settings) 90vh, gold headers, red Log Out (Task 9)
- ✅ Sheet B (Catalog Selector) h-2/3, 4 rows with lock icons (Task 8)
- ✅ AnimatePresence route transitions (Task 6)
- ✅ Profile → left-slide, News → right-slide (Task 6 `getVariants`)
- ✅ Dummy /catalog, /profile, /news pages (Task 15)
- ✅ ChatProvider lifts useChat + voice (Task 5)
- ✅ UIStateProvider bridges TopNav ↔ FloatingInput (Task 4)
- ✅ layout.tsx stays server component (Task 12)
- ✅ FloatingInput placeholder morphs on route (Task 11)
- ✅ Z-index: content z-30, FloatingInput z-40, TopNav z-50, BottomSheet z-[60] (Tasks 6, 7, 10, 11)
- ✅ Dark-adapted ChatMessage bubbles + ProductCard (Task 14)
- ✅ Profile button → Sheet A; account row → navigates to /profile (Tasks 9, 10)
