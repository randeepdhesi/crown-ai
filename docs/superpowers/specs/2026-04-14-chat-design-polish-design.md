# Chat Design Polish

**Date:** 2026-04-14  
**Status:** Approved

## Overview

Four targeted visual improvements to the Crown AI chat interface. No structural changes — purely CSS/className tweaks to `ChatMessage.tsx`, `app/page.tsx`, and `app/globals.css`.

## Changes

### 1. Assistant Message Bubbles — Wider + More Padding

**File:** `components/ChatMessage.tsx`

- `max-w-[80%]` → `max-w-[90%]`
- Padding: `px-4 py-3` → `px-5 py-4`
- Add left accent: `border-l-[3px] border-crown-gold`
- Remove `border border-gray-100` (replaced by left accent)
- Keep `shadow-sm`, `bg-white`, `rounded-2xl rounded-tl-md`

User bubbles are unchanged.

### 2. Header — Taller + More Presence

**File:** `app/page.tsx`

- `py-3` → `py-5` on the `<header>` element
- Add `shadow-md` to the header

### 3. Chat Area Background — Warm Gradient

**File:** `app/globals.css`

Add a utility class `.chat-bg` applied to the `<main>` chat scroll area:

```css
.chat-bg {
  background: linear-gradient(to bottom, #ede9e3, #f5f3f0);
  background-attachment: fixed;
}
```

Apply `.chat-bg` to the `<main>` element in `page.tsx` alongside existing `chat-scroll` class.

The `body` background stays as `#f5f3f0` so there's no flash.

## Files Touched

| File | Change |
|------|--------|
| `components/ChatMessage.tsx` | Assistant bubble width, padding, left border |
| `app/page.tsx` | Header padding + shadow, main bg class |
| `app/globals.css` | `.chat-bg` gradient utility |

## Out of Scope

- User message bubbles
- Typography, font sizes, animations
- Input area
- Mobile/responsive layout changes
