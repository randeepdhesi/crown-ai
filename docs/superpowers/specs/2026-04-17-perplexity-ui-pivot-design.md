# Phase 2 Design Spec: Perplexity-Style UI Pivot with Framer Motion

**Date:** 2026-04-17  
**Status:** Approved  
**Approach:** Option A — Full Framer Motion Architecture

---

## 1. Goals

Transform Crown AI from a single-page light-mode chat app into a minimalist, premium dark-mode experience inspired by Perplexity. All animations use Framer Motion for consistent spring-physics quality. The app must feel like a native mobile PWA.

---

## 2. Dependencies to Install

- `framer-motion` — all transitions, bottom sheets, button pulses
- `next-themes` — `ThemeProvider` with `attribute="class" defaultTheme="dark"`

---

## 3. File Structure

```
app/
  layout.tsx               (server component — shell only; renders providers + persistent UI)
  globals.css              (updated: dark body #121212, dark markdown/table/code overrides)
  page.tsx                 (chat view — reads from ChatContext, no useChat hook here)
  catalog/page.tsx         (dummy skeleton grid — 3×3 dark cards)
  profile/page.tsx         (dummy Threads/search history page — slides in from left)
  news/page.tsx            (dummy news page — slides in from right)

components/
  ChatProvider.tsx         ("use client" — context + useChat + voice logic)
  UIStateProvider.tsx      ("use client" — openSheet state shared between TopNav + FloatingInput)
  PageTransitionWrapper.tsx("use client" — AnimatePresence keyed on usePathname)
  TopNav.tsx               ("use client" — fixed header)
  FloatingInput.tsx        ("use client" — floating bottom input; reads UIStateContext)
  BottomSheet.tsx          ("use client" — reusable Framer sheet)
  SheetSettings.tsx        (Sheet A content — 90vh)
  SheetCatalogSelector.tsx (Sheet B content — h-2/3)
  ChatMessage.tsx          (dark-mode adapted, unchanged logic)
  TypingIndicator.tsx      (unchanged)
  SuggestedQuestions.tsx   (unchanged)
  CrownLogo.tsx            (unchanged)
```

---

## 4. Theme & Color System

| Token | Value | Usage |
|-------|-------|-------|
| Body background | `#121212` / `bg-neutral-950` | `<body>` |
| Surface | `bg-neutral-900` (`#171717`) | Cards, sheets, AI message bubbles |
| Input pill | `bg-neutral-800/80 backdrop-blur-md border border-white/10` | FloatingInput container |
| TopNav | `bg-neutral-950/80 backdrop-blur-sm border-b border-white/5` | Fixed header |
| Crown gold | `#b3874b` | Accents, active states, sheet headers |
| User messages | `bg-neutral-800` | User chat bubble |
| AI messages | `bg-neutral-900 border-l-[3px] border-crown-gold` | AI chat bubble |
| Secondary text | `text-neutral-400` | Subtitles, inactive icons |
| Destructive | `text-red-500` | Log Out button |

`globals.css`: Replace warm light palette. Update `.message-content` table borders to `border-neutral-700`. Update `th` background to `bg-neutral-800`. Update `code` background to `rgba(255,255,255,0.08)`. `.chat-bg` becomes `background: #121212`.

---

## 5. ChatProvider (`components/ChatProvider.tsx`)

**Pattern:** React Context + `useChat`

Exposes via context:
- `messages`, `input`, `handleInputChange`, `handleSubmit`, `isLoading`, `append`, `setMessages`, `setInput`
- `isListening`, `toggleListening`, `isSpeechSupported`

Voice recognition logic (currently in `page.tsx`) moves entirely here.  
`recognitionRef`, `inputValueRef` — stay as refs inside the provider.

**Usage in layout:**
```tsx
<ChatProvider>
  <UIStateProvider>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TopNav />
      <PageTransitionWrapper>{children}</PageTransitionWrapper>
      <FloatingInput />
    </ThemeProvider>
  </UIStateProvider>
</ChatProvider>
```

---

## 6. Layout (`app/layout.tsx`)

Remains a **server component** — no `"use client"`. All client interactivity is delegated to child components. Renders:
1. `<ChatProvider>` (wraps everything)
2. `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>`
3. `<TopNav />` (fixed, sits outside the scrollable area)
4. `<PageTransitionWrapper>` wrapping `{children}`
5. `<FloatingInput />` (fixed, sits outside the scrollable area)

`<body>` class: `bg-neutral-950 min-h-screen`.

---

## 7. TopNav (`components/TopNav.tsx`)

**Position:** `fixed top-0 left-0 right-0 z-50 h-14`  
**Style:** `bg-neutral-950/80 backdrop-blur-sm border-b border-white/5`

### Layout (3-column flex):

**Left — Profile Button:**
- `w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center`
- Icon: `UserCircle` (lucide-react, size 18, `text-neutral-300`)
- `onClick` → opens **Sheet A (Settings)** via sheet state lifted into `FloatingInput` or a shared `UIStateContext`
- Does NOT navigate — navigation to `/profile` is triggered from inside Sheet A

**Center — Mode Toggle Pill:**
- Container: `bg-neutral-800/60 rounded-full p-1 flex gap-1`
- Two buttons: "Chat" (`MessageCircle` icon + label) and "Catalog" (`Grid2x2` icon + label)
- Active: `bg-neutral-700 text-white rounded-full px-3 py-1.5`
- Inactive: `text-neutral-400 px-3 py-1.5`
- Active state derived from `usePathname()`: `/` → Chat active, `/catalog` → Catalog active
- Clicking Chat → `router.push('/')`, Catalog → `router.push('/catalog')`

**Right — News Button:**
- `w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center`
- Icon: `Newspaper` (lucide-react, size 18, `text-neutral-300`)
- `onClick` → `router.push('/news')`

---

## 8. FloatingInput (`components/FloatingInput.tsx`)

**Position:** `fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40`

**Container:** `bg-neutral-800/80 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 flex flex-col gap-2`

### Top row — toolbar:
- Left: `"Catalog"` pill button: `bg-neutral-700 text-neutral-300 text-xs rounded-full px-3 py-1`
  - `onClick` → `setOpenSheet('catalog')`
  - Shows current active data source name (default: "All Inventory")
  
### Bottom row — input:
- `<textarea>` reads `input` / `handleInputChange` / `handleKeyDown` from `ChatContext`
- `placeholder`: changes based on route — `/` → `"Ask about products, specs..."`, `/catalog` → `"Search the full catalog..."`
- Mic button: when `isListening`, Framer `animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 0.9 }}`
- Send button: when `isLoading`, same pulse animation

### Sheet state:
```tsx
const [openSheet, setOpenSheet] = useState<'settings' | 'catalog' | null>(null)
```
Both `<SheetSettings>` and `<SheetCatalogSelector>` rendered inside `FloatingInput` receive `isOpen` and `onClose` props.

> **Note:** TopNav profile button also needs to trigger `openSheet('settings')`. Since TopNav and FloatingInput are siblings in layout, lift sheet state into a shared `UIStateContext` (a second small context providing `openSheet`, `setOpenSheet`).

---

## 9. BottomSheet (`components/BottomSheet.tsx`)

Reusable component. Props: `isOpen: boolean`, `onClose: () => void`, `heightClass: string`, `children: ReactNode`.

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`fixed bottom-0 left-0 right-0 ${heightClass} bg-neutral-900 rounded-t-2xl z-50 overflow-y-auto`}
      >
        <div className="w-10 h-1 bg-neutral-600 rounded-full mx-auto mt-3 mb-4" />
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

## 10. Sheet A: Settings (`components/SheetSettings.tsx`)

**Trigger:** Profile button in TopNav  
**Height:** `h-[90vh]`

### Content:
- **Header row:** Crown AI wordmark or "Settings" title in `text-white font-semibold`
- **Account section** (`text-crown-gold text-xs uppercase tracking-widest` header):
  - Row 1 — Avatar + Name + Email + `ChevronRight` icon → `router.push('/profile')` (navigates to Threads/history page)
- **Preferences section** (`text-crown-gold` header):
  - Row: "Notifications" label / "Manage alerts" subtext / dummy `<Switch>` (styled toggle using Tailwind, no library needed)
  - Row: "Language" label / "English" subtext / `ChevronRight`
- **Danger section:**
  - Log Out button: `text-red-500 w-full text-left px-4 py-3 bg-neutral-800/50 rounded-xl`

Row style: `bg-neutral-800/50 rounded-xl px-4 py-3 flex items-center gap-3 mb-2`

---

## 11. Sheet B: Catalog Selector (`components/SheetCatalogSelector.tsx`)

**Trigger:** "Catalog" pill in FloatingInput  
**Height:** `h-2/3`

**Title:** `"Data Source"` in `text-white font-semibold px-4 mb-4`

| Icon | Label | Right |
|------|-------|-------|
| `Package` (lucide) | All Inventory | `Check` (gold, active) |
| `FileText` | NewTechWood Specs | `Lock` (neutral-500) |
| `FileText` | CGC Drywall | `Lock` (neutral-500) |
| `Layers` | ROCKWOOL Guides | `Lock` (neutral-500) |

- Active row: `text-crown-gold` label
- Locked rows: `text-neutral-500` label, lock icon communicates unavailability
- Row style: same `bg-neutral-800/50 rounded-xl px-4 py-3` pattern
- Selecting a row updates a `selectedSource` state (local to FloatingInput/UIStateContext) and updates the pill label

---

## 12. Route Transitions (`components/PageTransitionWrapper.tsx`)

```tsx
"use client"
const pathname = usePathname()

<AnimatePresence mode="wait">
  <motion.div key={pathname} ...>
    {children}
  </motion.div>
</AnimatePresence>
```

Direction logic per route:
- `/profile` → `initial={{ opacity: 0, x: -40 }}`, `exit={{ opacity: 0, x: 40 }}`
- `/news` → `initial={{ opacity: 0, x: 40 }}`, `exit={{ opacity: 0, x: -40 }}`
- All others (`/`, `/catalog`) → `initial={{ opacity: 0, y: 8 }}`, `exit={{ opacity: 0, y: -8 }}`

Transition: `{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }`

---

## 13. Z-Index Layering

| Layer | z-index | Component |
|-------|---------|-----------|
| Page content | z-30 | `PageTransitionWrapper` children |
| Floating input | z-40 | `FloatingInput` |
| TopNav | z-50 | `TopNav` |
| Sheet overlay (backdrop + sheet) | z-[60] | `BottomSheet` |

When a sheet is open, `BottomSheet` (z-[60]) sits above both FloatingInput (z-40) and TopNav (z-50), ensuring a 90vh settings sheet fully covers the header and the input does not bleed through.

---

## 14. Dummy Pages

**`/catalog`**: `3×3` grid of skeleton cards (`bg-neutral-800 animate-pulse rounded-xl h-32`). Title: `"Catalog"` in `text-white font-bold text-xl`.

**`/profile`**: Title "Threads". Single section showing 3 dummy thread row items (each `bg-neutral-900 rounded-xl px-4 py-3`). Back chevron in TopNav left slot (replaces profile button when on `/profile`).

**`/news`**: Title "Industry News". 3 dummy article cards (`bg-neutral-900 rounded-xl px-4 py-4 mb-3`).

All dummy pages have `pt-20 pb-32 px-4` padding to clear TopNav and FloatingInput.

---

## 15. dark-mode Adaptation: ChatMessage & ProductCard

`ChatMessage.tsx`:
- User bubble: `bg-neutral-800 text-white`
- AI bubble: `bg-neutral-900 text-neutral-100 border-l-[3px] border-crown-gold`
- Avatar backgrounds adapted to dark surfaces

`ProductCard` (inside ChatMessage):
- `bg-neutral-800` card background (was `bg-white`)
- `text-white` product name (was `text-crown-charcoal`)
- Table/code overrides in `globals.css` updated for dark

---

## 16. Open Items / Not In Scope

- Real profile/settings persistence (auth, user preferences) — out of scope for Phase 2
- Locked catalog sources becoming functional — out of scope
- Drag-to-dismiss gesture on bottom sheets — out of scope (spring close is sufficient)
- News page real content — out of scope
