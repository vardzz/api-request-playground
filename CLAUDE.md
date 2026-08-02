# CLAUDE.md — API Request Playground

> **Master Plan:** `plan.md` is the single source of truth. Always consult `plan.md` before executing tasks.

## Build, Test & Lint Commands

- `npm run dev` — Start Next.js development server
- `npm run build` — Build production bundle
- `npm run lint` — Run ESLint check
- `npx tsc --noEmit` — Run TypeScript type-checking

## Project Context & Architecture

- **Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, Native Fetch, TypeScript.
- **Purpose:** University assignment showcasing AI-assisted development vs. manual refactoring (tracked in `DEV_LOG.md`).
- **State Model:** Single source of truth using `useReducer` + Context (`RequestContext.tsx` + `requestReducer.ts`).
- **File Hierarchy:** Strictly adhere to the structure defined in `plan.md` Section 1. Do not invent new folders or rename existing modules without user confirmation.

## Critical Invariants & Rules

### 1. Execution Order & Workflow

- **Strict Phasing:** Execute phases sequentially (0 → 1 → 2 → 3 → 4 → 5 → 6 → 7). Never jump ahead or scaffold UI before state exists.
- **Closed Action List:** Use ONLY the reducer actions defined in `plan.md` Section 2. Do not introduce ad hoc actions.
- **Minimal Dependencies:** Use native Fetch, Lucide Icons, and Tailwind CSS. Do not install external state or UI libraries unless requested.

### 2. State & Component Engineering

- **Immutability:** Reducer logic updating `params` or `headers` MUST use immutable operations (`.map()`, `.filter()`, spread syntax). Never mutate state in place.
- **React Keys:** Dynamic key-value rows MUST use stable `crypto.randomUUID()` IDs. NEVER use array indices as keys.
- **State Isolation:** Do not duplicate reducer state in local component `useState`. Keep state unified.
- **Body State:** `body` stays a raw string in state; validate on demand, never parse on every keystroke.

### 3. Next.js App Router & SSR Safety

- **Client Boundaries:** Always place `'use client'` at the top of files using React hooks, browser APIs, or local state.
- **Hydration Safety:** `localStorage` access MUST be guarded (`typeof window !== 'undefined'`) and handled inside `useEffect` or event listeners. Never read storage on initial SSR render.

### 4. Fetch Execution & Error Handling

- **Query Params:** Construct query strings strictly using `URLSearchParams`—never manual string concatenation.
- **Body Omission:** Omit request bodies entirely for `GET` and `HEAD` methods.
- **Error Segmentation:** Distinguish thrown network/CORS failures (`TypeError: Failed to fetch`) from valid HTTP error responses (`4xx`/`5xx`). Render distinct UI messages for each.
- **JSON Safety:** Wrap all `JSON.parse` operations in `try/catch` with explicit fallback states. Debounce body validation.
- **Performance:** Wrap expensive parsing/tokenizing (e.g., JSON syntax highlighting) in `useMemo` keyed on primitive payload content.

## DEV_LOG & Communication Protocol

- Implement ONLY what is requested in the active phase prompt.
- After completing code generation for a phase, provide a brief summary of what was built and explicitly call out potential pitfalls (from `plan.md` Section 4) for the user to document in `DEV_LOG.md`.
