'use client';

import { RequestProvider } from '../context/RequestContext';
import RequestWorkbench from '../components/workbench/RequestWorkbench';
import ResponsePanel from '../components/response/ResponsePanel';
import HistorySidebar from '../components/history/HistorySidebar';

export default function Home() {
  return (
    <RequestProvider>
      <div className="flex flex-col h-screen overflow-hidden font-sans bg-zinc-950 text-zinc-100">
        {/* Header Bar */}
        <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 flex-shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold tracking-tighter">
              API
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Request Playground</h1>
            <span className="hidden md:inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
              Workspace
            </span>
          </div>
        </header>

        {/* Main Application Area */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <HistorySidebar />
          
          <main className="flex-1 flex overflow-hidden">
            <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-px bg-zinc-800/50">
              {/* Left Workspace */}
              <section className="flex flex-col h-full bg-zinc-950 overflow-hidden">
                <RequestWorkbench />
              </section>
              
              {/* Right Workspace */}
              <section className="flex flex-col h-full bg-zinc-950 overflow-hidden">
                <ResponsePanel />
              </section>
            </div>
          </main>
        </div>
      </div>
    </RequestProvider>
  );
}
