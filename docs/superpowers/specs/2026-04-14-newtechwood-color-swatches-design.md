# NewTechWood Color Swatches

**Date:** 2026-04-14  
**Status:** Approved

## Overview

Two changes: (1) instruct the AI to always emit hex codes alongside NewTechWood color names using a `[#hexcode]` syntax, and (2) render those tokens as inline colored circles in the chat UI so users see a visual swatch instead of raw bracket text.

## Changes

### 1. System Prompt — New Guideline

**File:** `lib/system-prompt.ts`

Add as guideline #9 in the RESPONSE GUIDELINES section:

> When listing NewTechWood colors, always include the hex code in square brackets after each color name. Use these exact mappings: Ipe [#3B2314], Teak [#8B6A3E], Red Cedar [#A0522D], Cedar [#C19A6B], Antique [#8E7960], White Dew [#D9D0C1], Silver Grey [#A9A9A9], Charcoal [#4A4A4A], Ebony [#1C1C1C]. Always include these hex codes when colors are mentioned.

### 2. Color Swatch Rendering

**Approach:** Pre-process content + `rehype-raw`

**New package:** `rehype-raw` (allows raw HTML nodes through the rehype pipeline)

**File:** `components/ChatMessage.tsx`

- Add a `renderWithSwatches(content: string): string` helper that replaces every `[#XXXXXX]` (case-insensitive 6-digit hex) with:
  ```html
  <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#XXXXXX;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin:0 3px 1px 2px;flex-shrink:0;"></span>
  ```
- Apply `renderWithSwatches` to `content` before passing to `<ReactMarkdown>`
- Add `rehypePlugins={[rehypeRaw]}` to `<ReactMarkdown>`

## Security Note

`rehype-raw` is safe here: only assistant messages go through this path, and the hex pattern is validated by a strict regex (`/#[0-9a-fA-F]{6}/`) before substitution. No user input reaches the raw HTML path.

## Files Touched

| File | Change |
|------|--------|
| `lib/system-prompt.ts` | Add guideline #9 with hex mappings |
| `components/ChatMessage.tsx` | `renderWithSwatches` helper + `rehype-raw` plugin |
| `package.json` / `node_modules` | Add `rehype-raw` dependency |
