# API Request Playground

> **A robust, locally-hosted Postman alternative built to explore AI-assisted development paradigms and modern React architecture.**

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

---

## 📖 Overview

The **API Request Playground** is a lightweight, responsive client for crafting, executing, and analyzing HTTP requests directly from the browser. It features a complete `GET/POST/PUT/DELETE/PATCH` builder, dynamic headers and query parameters, live JSON validation, and a syntax-highlighted response visualizer.

This project was built as an academic assignment to showcase the nuances of **AI-Assisted Development**. Instead of letting an AI generate a naive "throwaway" application, this project was carefully scaffolded over 7 phases, heavily documenting the AI's technical flaws (e.g., array mutations, hydration errors, SSR mismatches) and the manual software engineering required to refactor those flaws into production-grade systems.

*See [`DEV_LOG.md`](./DEV_LOG.md) for the complete breakdown of prompts, AI flaws, and manual refactoring entries.*

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd api-request-playground
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture & Data Flow

The application adheres to a strict uni-directional data flow, utilizing a globally available `useReducer` to manage complex, nested UI states predictably.

### Component Hierarchy

```text
app/page.tsx (Root)
 ├── RequestProvider (Context Wrapper)
 ├── HistorySidebar
 │    └── HistoryItem (x N)
 ├── RequestWorkbench
 │    ├── MethodSelector
 │    ├── UrlBar
 │    ├── KeyValueEditor (Params/Headers)
 │    └── BodyEditor (Debounced Validation)
 └── ResponsePanel
      ├── StatusBadge
      ├── MetaBar (Latency & Bytes)
      ├── JsonViewer (Regex Tokenizer)
      └── HeadersInspector
```

### State Management (`useReducer` + Context API)

To optimize rendering performance, the React Context is split into two providers:
1. `RequestStateContext` — Read-only state access for the response viewer.
2. `RequestDispatchContext` — Write-only dispatch access for inputs.

This guarantees that deeply nested inputs (like the HTTP method dropdown) do not re-render the entire application tree upon changing state.

### `localStorage` & Hydration

Request history is intelligently bounded to the last 50 queries. To prevent exceeding browser `localStorage` quotas (~5MB), full response payloads are dropped from storage; only lightweight request configurations and response metadata (status, latency) are serialized. 

Storage hydration is heavily guarded against Next.js Server-Side Rendering (SSR) mismatches by fetching initial state strictly inside a client-side `useEffect` hook.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **UI & Styling:** [React 18](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript
- **HTTP Engine:** Native Browser `fetch()` API
