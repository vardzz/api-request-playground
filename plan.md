# API Request Playground — Master Execution Plan

**Stack:** Next.js 14 (App Router) · React 18 · Tailwind CSS · Native Fetch · Lucide Icons

---

## 0. Ground Rules Before You Start

Since this is an assignment where you're documenting AI-assisted development + manual refactoring, set up your workflow first:

- **Git discipline:** Commit after every phase (not every file). Use commit messages that separate "AI-scaffolded" vs "manually refactored" work — e.g. `feat(ai): scaffold RequestBuilder [AI-generated]` vs `refactor(manual): fix header array mutation bug`.
- **Keep a `DEV_LOG.md`** from day one. For each phase, log: (1) the prompt you fed the AI, (2) what it got wrong, (3) what you changed and why. This becomes your submission evidence.
- **Next.js App Router caveat:** Almost everything here is interactive client state (inputs, fetch calls, localStorage) — you'll be reaching for `'use client'` on most components. Keep this in mind so you don't accidentally try to fetch or use hooks in a Server Component.

---

## 1. Phase-by-Phase Roadmap

### Phase 0 — Project Scaffold

**Goal:** Clean Next.js project with Tailwind + folder skeleton, no logic yet.

```
api-request-playground/
├── app/
│   ├── layout.tsx              # Root layout, fonts, global providers
│   ├── page.tsx                # Main playground page (composes everything)
│   └── globals.css
├── components/
│   ├── workbench/
│   │   ├── MethodSelector.tsx
│   │   ├── UrlBar.tsx
│   │   ├── KeyValueEditor.tsx      # reusable for Params AND Headers
│   │   ├── BodyEditor.tsx
│   │   └── RequestWorkbench.tsx    # composes the above
│   ├── response/
│   │   ├── StatusBadge.tsx
│   │   ├── MetaBar.tsx             # time + size
│   │   ├── JsonViewer.tsx
│   │   ├── HeadersInspector.tsx
│   │   └── ResponsePanel.tsx       # composes the above (with tabs)
│   ├── history/
│   │   ├── HistoryItem.tsx
│   │   └── HistorySidebar.tsx
│   └── ui/                        # small shared primitives (Button, Tabs, Spinner)
├── context/
│   └── RequestContext.tsx         # useReducer + Context provider
├── reducers/
│   └── requestReducer.ts          # action types + reducer logic
├── hooks/
│   ├── useHistory.ts              # localStorage read/write logic
│   └── useSendRequest.ts          # fetch execution + timing/size calc
├── lib/
│   ├── json-utils.ts              # safe parse/stringify, pretty-print
│   ├── http-utils.ts              # byte size calc, status color mapping
│   └── storage.ts                 # localStorage wrapper (SSR-safe)
├── types/
│   └── index.ts                   # RequestConfig, ResponseData, HistoryEntry types
└── DEV_LOG.md
```

**Decision to lock in now:** TypeScript or plain JS? For an assignment demonstrating architecture quality, TypeScript is worth the extra setup — it forces you (and the AI) to be explicit about the request/response shape, which prevents a whole class of bugs described in Section 4. This plan assumes TS but everything maps 1:1 to JS if you skip it.

---

### Phase 1 — State Architecture (build this before any UI)

**Goal:** `RequestContext` + `requestReducer` fully working and testable via console/dummy buttons, before wiring real components.

Why first: if you build UI before state, you'll end up prop-drilling and then need to refactor it anyway (that refactor won't teach you anything new — do it right the first time).

**Deliverables:**

- `types/index.ts` with `RequestConfig`, `KeyValuePair`, `ResponseData`, `HistoryEntry`
- `reducers/requestReducer.ts` with all action types stubbed
- `context/RequestContext.tsx` wrapping `app/page.tsx` (or a `Providers.tsx` client wrapper used in `layout.tsx`)

---

### Phase 2 — Request Workbench UI

**Goal:** All input components wired to the reducer, no fetch logic yet — just state updates you can inspect via React DevTools.

Build order: `MethodSelector` → `UrlBar` → `KeyValueEditor` (used twice: params + headers) → `BodyEditor` (with live JSON validity indicator) → compose into `RequestWorkbench`.

The `KeyValueEditor` is the trickiest component here (dynamic add/remove/edit rows) — see Pitfall #2 in Section 4 before building it.

---

### Phase 3 — Fetch Execution Layer

**Goal:** `useSendRequest` hook that takes the current `RequestConfig`, executes it, times it, measures payload size, and dispatches the result into state.

**Deliverables:**

- `lib/http-utils.ts`: `calculatePayloadSize()`, `getStatusColorClass()`
- `hooks/useSendRequest.ts`: wraps `fetch`, uses `performance.now()` for timing, handles network errors vs HTTP errors distinctly
- Wire a "Send" button in `RequestWorkbench` that calls this hook

At this point you should be able to hit a real API (e.g. `https://jsonplaceholder.typicode.com/posts/1`) and get state populated, even with no Response Panel UI yet.

---

### Phase 4 — Response Panel UI

**Goal:** Visualize what Phase 3 produces.

Build order: `StatusBadge` (color logic from `getStatusColorClass`) → `MetaBar` (time/size) → `JsonViewer` (syntax highlighting — see tooling note below) → `HeadersInspector` → tabbed `ResponsePanel` container.

**Tooling note:** For syntax highlighting, either hand-roll a small JSON tokenizer/highlighter (good learning value, more manual-refactor material) or use a lightweight lib like `react-json-view-lite`. If the assignment values "custom implementation," lean toward hand-rolling — it's also a natural place to demonstrate AI-vs-manual work since AI tends to get token-boundary edge cases wrong (see Pitfall #5).

---

### Phase 5 — History & Persistence

**Goal:** Every sent request gets logged to localStorage; sidebar lists them; clicking one reloads it into the workbench.

**Deliverables:**

- `lib/storage.ts`: SSR-safe localStorage wrapper (guard against `window is undefined` during Next.js server render/hydration)
- `hooks/useHistory.ts`: `addEntry()`, `getEntries()`, `clearHistory()`, wraps `storage.ts`
- `HistorySidebar` + `HistoryItem`, dispatching a `LOAD_FROM_HISTORY` action back into `requestReducer`

This phase has the most Next.js-specific gotchas (hydration mismatches) — see Pitfall #4.

---

### Phase 6 — Polish & Edge Cases

- Loading states (spinner on Send button, disable while in-flight)
- Error states (network failure, invalid URL, CORS block — display distinctly from a valid 4xx/5xx response)
- Empty states (no history yet, no response yet)
- Keyboard shortcuts (optional: Cmd/Ctrl+Enter to send)
- Responsive layout pass

---

### Phase 7 — Documentation Pass

- Finalize `DEV_LOG.md` with all AI-prompt-vs-manual-refactor entries
- README with architecture diagram (component tree + data flow)
- Screenshot/GIF of the working app

---

## 2. Recommended State Model

Use a **single `useReducer` + Context**, not multiple scattered `useState` calls. One source of truth for the whole workbench-response-history triangle avoids prop-drilling across three sibling component trees.

### Shape

```typescript
// types/index.ts
export interface KeyValuePair {
  id: string; // crypto.randomUUID() — NEVER use array index as id
  key: string;
  value: string;
  enabled: boolean; // lets user "disable" a row without deleting it (Postman-style)
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: string; // raw string; parse-on-send, not parse-on-keystroke
  bodyIsValidJson: boolean;
}

export interface ResponseData {
  status: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number;
  headers: Record<string, string>;
  data: unknown;
  error: string | null; // distinguishes network/CORS failure from a real HTTP response
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  request: RequestConfig;
  responseSummary: {
    // don't store the full response body in history — see Pitfall #6
    status: number;
    timeMs: number;
  };
}

export interface PlaygroundState {
  request: RequestConfig;
  response: ResponseData | null;
  isLoading: boolean;
  history: HistoryEntry[];
}
```

### Reducer actions (keep this list explicit and closed — resist letting the AI invent ad hoc actions later)

```
SET_METHOD
SET_URL
ADD_PARAM / UPDATE_PARAM / REMOVE_PARAM
ADD_HEADER / UPDATE_HEADER / REMOVE_HEADER
SET_BODY
REQUEST_START
REQUEST_SUCCESS  (payload: ResponseData)
REQUEST_ERROR     (payload: error message)
LOAD_FROM_HISTORY (payload: HistoryEntry)
CLEAR_HISTORY
```

### Why this shape works

- **Params and Headers share `KeyValuePair[]`** → one `KeyValueEditor` component, reused with different action prefixes (pass `type: 'param' | 'header'` as a prop, or just two thin wrapper components around one generic reducer action).
- **`body` stays a raw string in state**, validated on-demand — not parsed into an object on every keystroke. This avoids re-render thrash and matches how real API clients behave (you can type invalid JSON mid-edit without it exploding).
- **History stores a `responseSummary`, not the full response** — full payloads can be large/non-serializable (see Pitfall #6), and localStorage has a ~5MB ceiling.
- **Context split option (if you want extra architectural credit):** split into `RequestStateContext` (read) and `RequestDispatchContext` (write) so components that only dispatch don't re-render when state changes. Worth mentioning in your write-up even if you don't implement it — shows you understand the tradeoff.

---

## 3. Step-by-Step AI Prompt Sequence

Feed these to me (or your AI partner) **one at a time, in order**. Don't batch them — each prompt should produce something you review and commit before moving to the next. After each AI response, that's your cue to open `DEV_LOG.md` and note what needed manual fixing.

**Prompt 1 — Scaffold**

> "Scaffold a Next.js 14 App Router project structure for a React API testing tool. Set up Tailwind CSS. Create the folder structure: components/workbench, components/response, components/history, components/ui, context, reducers, hooks, lib, types. Don't write component logic yet — just create empty files with basic exports and a types/index.ts with placeholder interfaces."

**Prompt 2 — Types & Reducer**

> "Using this state shape [paste the interfaces from Section 2], write requestReducer.ts implementing these actions: [paste action list]. Ensure all array updates (params/headers) are fully immutable — return new arrays, never mutate in place. Include the RequestContext.tsx provider using useReducer and export both state and dispatch via separate hooks (useRequestState, useRequestDispatch)."

**Prompt 3 — KeyValueEditor (build in isolation)**

> "Build a reusable KeyValueEditor component for dynamic key-value rows (used for both query params and headers). Each row needs a unique id (use crypto.randomUUID(), not array index), key input, value input, enabled checkbox, and remove button, plus an 'add row' button that always keeps one empty trailing row. Props: `items: KeyValuePair[]`, `onAdd`, `onUpdate`, `onRemove`. Make it fully controlled — no internal state."

**Prompt 4 — Remaining Workbench components**

> "Build MethodSelector (dropdown/segmented control for GET/POST/PUT/DELETE/PATCH), UrlBar (text input with basic URL format hint), and BodyEditor (textarea with a live 'Valid JSON' / 'Invalid JSON' indicator using a debounced validity check, not parsing on every keystroke). Wire all three to RequestContext via dispatch."

**Prompt 5 — Fetch hook**

> "Write useSendRequest.ts: a hook that reads RequestConfig from context, builds a URL with query params appended, executes fetch with method/headers/body, measures elapsed time with performance.now(), calculates response payload size in bytes from the response text length, and dispatches REQUEST_START / REQUEST_SUCCESS / REQUEST_ERROR. Distinguish network-level failures (CORS, DNS, offline) from valid HTTP error responses (4xx/5xx) — both should be handled differently in state."

**Prompt 6 — Response Panel**

> "Build StatusBadge (color-coded by status range: 2xx green, 4xx amber, 5xx red), MetaBar (shows response time in ms and size in KB/B formatted), a JsonViewer that pretty-prints and syntax-highlights the response JSON (tokenize by string/number/boolean/null/key), and HeadersInspector (simple key-value table). Compose into a tabbed ResponsePanel."

**Prompt 7 — History + localStorage**

> "Write lib/storage.ts as an SSR-safe localStorage wrapper — guard all access behind a check for `typeof window !== 'undefined'`, and wrap JSON.parse/stringify in try/catch. Then write useHistory.ts with addEntry/getEntries/clearHistory, storing only a lightweight summary (not full response bodies) per entry to avoid quota issues. Build HistorySidebar + HistoryItem, where clicking an item dispatches LOAD_FROM_HISTORY with the saved RequestConfig."

**Prompt 8 — Integration pass**

> "Review app/page.tsx and confirm RequestWorkbench, ResponsePanel, and HistorySidebar are all correctly reading from and writing to the same RequestContext with no local component state duplicating what's in the reducer. Flag any prop-drilling or redundant useState calls."

**Prompt 9 — Edge cases**

> "Add loading state (disable Send button + spinner while in-flight), error UI for network/CORS failures distinct from HTTP error status responses, and empty states for no-history and no-response-yet."

---

## 4. Anticipated Technical Pitfalls (your manual-refactor material)

This is where AI-generated code in this exact architecture tends to break. Document your fixes for these — they're the strongest evidence of manual engineering understanding in your assignment.

**1. CORS failures misread as app bugs**
AI-generated fetch wrappers often don't distinguish a CORS-blocked request (which throws a generic `TypeError: Failed to fetch` with zero useful detail) from a legitimate network error or a valid HTTP error response. Expect the AI to write a single `catch` block that dumps all three into one generic "Something went wrong" message. Manual fix: catch the specific `TypeError` pattern from `fetch`, and message it clearly as "Request blocked — likely CORS. This API doesn't allow browser-based requests from this origin," since that's a real and common outcome when testing arbitrary public APIs from a browser client.

**2. Array state mutation in KeyValueEditor**
The single most common AI mistake in this architecture: updating one row of `params`/`headers` by finding the index and mutating it directly (`state.params[i].value = newValue`) instead of returning a new array with a new object at that index. This causes stale renders or subtle bugs where React doesn't re-render because the array reference didn't change. Watch for this specifically in the reducer's `UPDATE_PARAM`/`UPDATE_HEADER` cases — every update should use `.map()` returning new objects, never in-place index assignment.

**3. Using array index as React `key`**
AI defaults to `key={index}` in the KeyValueEditor row map. This breaks badly here specifically because rows get added/removed/reordered — after a removal, React reuses DOM nodes for the wrong logical row, causing input focus to jump or stale values to appear in the wrong row. Fix: generate a stable `id` (`crypto.randomUUID()`) per row at creation time and key on that.

**4. localStorage + Next.js hydration mismatch**
Next.js renders once on the server (no `window`) and once on the client. If you read `localStorage` during initial render (e.g. `useState(() => getHistoryFromStorage())`), the server-rendered HTML won't match the client's first render, producing a hydration error or a flash of empty history. Fix: initialize state empty, then populate it inside a `useEffect` that only runs client-side, and guard `lib/storage.ts` functions with `typeof window !== 'undefined'` checks.

**5. Invalid/partial JSON parsing crashing the app**
Two spots this bites you: (a) the BodyEditor — if you `JSON.parse()` on every keystroke to validate, a half-typed JSON object crashes into a red error state on every character; (b) the JsonViewer — if the response isn't valid JSON (some APIs return plain text or HTML on error), a naive `JSON.parse(responseText)` throws unhandled. Fix: debounce body validation, wrap all response parsing in try/catch with a plain-text fallback view, and never let a parse failure crash the render — surface it as a distinct UI state instead.

**6. Blowing the localStorage quota by storing full responses in history**
AI will often store the entire request+response pair per history entry for "completeness." localStorage caps around 5MB total; a handful of large API responses (image APIs, big JSON payloads) will silently fail to save, and `JSON.stringify` on circular or huge objects can also throw. Fix: store only the request config + a response summary (status, time) in history, never the full response body.

**7. Syntax highlighting performance / infinite re-render**
A hand-rolled JSON tokenizer re-run on every render (rather than memoized) can visibly lag on larger responses, and if it's implemented as a `useEffect` that sets state based on a prop that's a new object reference every render (e.g. passing `response.data` where `response` is reconstructed each render), you'll get a re-render loop. Fix: wrap the tokenizer output in `useMemo` keyed on the actual response content, not the object reference.

**8. Query params not URL-encoded**
AI-generated URL-building logic often does naive string concatenation (`url + '?' + key + '=' + value`) instead of using `URLSearchParams`, which breaks on special characters (spaces, `&`, `#`) in param values. Fix: always build query strings via `URLSearchParams`.

**9. Method/body mismatch not handled**
GET/DELETE requests with a non-empty body will throw in some environments (`fetch` disallows body on GET). AI code often always attaches `body: requestBody` regardless of method. Fix: conditionally omit `body` for GET/HEAD.

---

## Suggested Time Allocation (rough guide, adjust to your deadline)

| Phase | Focus            | Relative Effort |
| ----- | ---------------- | --------------- |
| 0–1   | Scaffold + State | 15%             |
| 2     | Workbench UI     | 20%             |
| 3     | Fetch layer      | 15%             |
| 4     | Response Panel   | 20%             |
| 5     | History          | 15%             |
| 6–7   | Polish + Docs    | 15%             |

Start with Phase 0 and Prompt 1 whenever you're ready — feed me that prompt and we'll go step by step.
