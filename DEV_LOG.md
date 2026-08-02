# DEV_LOG: AI-Assisted Development vs. Manual Refactoring

This log tracks the progression of the API Request Playground, specifically highlighting the exact prompts given to the AI, the architectural flaws or technical debt it produced, and the manual engineering interventions required to build a production-ready application.

## Phase 0 — Project Scaffold
**Prompt:** "Scaffold a Next.js 14 App Router project structure for a React API testing tool. Set up Tailwind CSS... Ensure zero component business logic is included yet — only folder layout, empty exports, types, and setup files."
**AI Flaws:** The AI generated the project utilizing the optional Next.js `src/app` architecture despite the explicit file hierarchy rules requiring a root-level `app/` directory. It also initially failed to recognize that interactive App Router scaffolding requires `'use client'` directives.
**Manual Refactoring:** Forced the migration of the `app/` directory from `src/app/` to the root folder to align with the rigid assignment architecture requirements. Validated all placeholder components were accurately flagged with `'use client'`.

## Phase 1 — State Architecture
**Prompt:** "Implement the complete `requestReducer` and `RequestContext` based on Section 2 of plan.md. This must be fully functional and testable before any UI logic is added."
**AI Flaws:** Naive AI solutions often bundle state and dispatch into a single React context, forcing every deeply nested UI component (e.g. nested buttons) to re-render whenever *any* state changes. They also tend to use `.push()` or in-place object assignment in the reducer (e.g., `state.params[i] = ...`), completely breaking React's immutability invariants.
**Manual Refactoring:** Split the Context into `RequestStateContext` and `RequestDispatchContext`. Enforced strict array immutability (`.map()` and `.filter()`) across `ADD_PARAM`, `UPDATE_PARAM`, and `REMOVE_PARAM` to ensure 100% predictable UI reconciliation.

## Phase 2 — Request Workbench UI
**Prompt:** "Build all workbench input components, connect them directly to `RequestContext` via dispatch, and compose them inside `RequestWorkbench.tsx`."
**AI Flaws:** The AI frequently uses the mapped array `index` as the React `key` for dynamically reordered lists like Key/Value pairs. Furthermore, for live JSON bodies, the AI will often attempt to `JSON.parse` strictly inside the `onChange` event, crashing the app on invalid keystrokes.
**Manual Refactoring:** Engineered `crypto.randomUUID()` generation upon row instantiation within `KeyValueEditor.tsx` to ensure stable React DOM reconciliation when users delete or reorder headers. Implemented a 400ms debounced `useEffect` coupled with local component state in `BodyEditor.tsx`, allowing the user to type malformed JSON without crashing the global state tree.

## Phase 3 — Fetch Execution Layer
**Prompt:** "Build the HTTP request execution engine (`lib/http-utils.ts` and `hooks/useSendRequest.ts`) and attach it to the 'Send' trigger in the workbench."
**AI Flaws:** The AI consistently bundles all rejected network events (DNS failures, CORS blocks) alongside valid HTTP failures (`4xx`, `5xx`), treating them as equivalent errors. It also routinely builds naive query strings (`url + "?" + key + "=" + val`) resulting in URL injection vulnerabilities or broken special characters.
**Manual Refactoring:** Re-architected `hooks/useSendRequest.ts` to trap the `TypeError: Failed to fetch` independently in the `catch` block to detect CORS blockages. Re-engineered URL construction to leverage the native `URLSearchParams` API, guaranteeing automatic URL-encoding and structural safety. Removed the body object on `GET` and `HEAD` requests to satisfy strict `fetch()` compliance requirements. Fixed an over-defensive TypeScript type-check against `HEAD` requests conflicting with the `HttpMethod` type schema.

## Phase 4 — Response Panel UI
**Prompt:** "Build and compose all components in `components/response/` to visualize response data and metadata produced in Phase 3."
**AI Flaws:** The AI's naive syntax-highlighter implementation runs an expensive regex pipeline directly inside the component body, dropping frames or drastically lagging the browser tab on multi-megabyte JSON responses. Secondly, AI frequently crashes when attempting to render an HTML 500 error page if it blindly expects `response.data` to be valid JSON.
**Manual Refactoring:** Wrapped the custom JSON tokenization logic inside a `useMemo` dependency array keyed tightly to the response payload string, ensuring it only computes once per response. Added a defensive fallback layer that seamlessly transitions into plain-text rendering if `JSON.stringify` or the regex engine fails on unstructured payload blobs.

## Phase 5 — History & Persistence
**Prompt:** "Implement client storage helpers, history hooks, and sidebar UI to persist request logs and reload them into the active workbench."
**AI Flaws:** Next.js server-side rendering (SSR) fundamentally conflicts with `localStorage`, leading to critical hydration mismatches if the AI blindly queries storage during initial React rendering. Furthermore, storing the complete HTTP response bodies in history exhausts the browser's ~5MB quota almost instantly.
**Manual Refactoring:** Engineered an SSR-safe storage abstraction wrapper that guards against `window is undefined`. Refactored `useHistory.ts` to initialize history strictly via a client-side `useEffect` to safely resolve hydration. Hard-capped history to 50 records and aggressively stripped payload bodies from the serialized structure, storing only the lightweight `responseSummary` metadata.

## Phase 6 — Polish & Edge Cases
**Prompt:** "Refine application resilience, UI states, keyboard controls, and responsive layout across the workbench, response panel, and history views."
**AI Flaws:** AI struggles to build holistic, responsive dashboards, often generating absolute widths that overflow mobile screens or break flex grids.
**Manual Refactoring:** Overhauled `app/page.tsx` and `HistorySidebar.tsx` to implement a responsive shift: side-by-side flex layout for desktop, and vertically stacked column navigation for mobile views. Hand-wired global event listeners into a `useEffect` inside `RequestWorkbench.tsx` to cleanly trap `Cmd+Enter` shortcuts anywhere within the application.
