'use client';

import { RequestProvider } from '../context/RequestContext';
import RequestWorkbench from '../components/workbench/RequestWorkbench';
import ResponsePanel from '../components/response/ResponsePanel';
import HistorySidebar from '../components/history/HistorySidebar';
import { Triangle, Search, Settings2, Plus } from 'lucide-react';

export default function Home() {
  return (
    <RequestProvider>
      <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#0d0d11] text-zinc-300">
        {/* Global Header */}
        <header className="h-14 border-b border-zinc-800/60 bg-[#0d0d11] flex items-center justify-between px-4 flex-shrink-0 z-20">
          
          {/* Left: Branding */}
          <div className="flex items-center gap-3 w-[22%]">
            <Triangle size={20} className="text-zinc-100 fill-zinc-100" />
            <h1 className="text-lg font-heading font-semibold tracking-tight text-zinc-100">Apex</h1>
            <span className="hidden md:inline-flex items-center rounded bg-zinc-800/60 px-2 py-0.5 text-xs font-medium text-zinc-300 border border-zinc-700/50">
              Workspace
            </span>
          </div>

          {/* Center: Global Search */}
          <div className="flex-1 max-w-[500px] mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-14 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-xs font-mono text-zinc-400 bg-zinc-800 rounded px-1.5 py-0.5">Ctrl K</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 w-[35%]">
          </div>
        </header>

        {/* Main Application Area */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row bg-[#0d0d11]">
          {/* History Sidebar */}
          <div className="hidden md:flex flex-col h-full border-r border-zinc-800/60 bg-[#13131a]" style={{ width: '22%' }}>
            <HistorySidebar />
          </div>
          
          <main className="flex-1 flex overflow-hidden">
            <div className="w-full flex">
              {/* Left Workspace */}
              <section className="flex flex-col h-full border-r border-zinc-800/60 bg-[#13131a]" style={{ width: '45%' }}>
                <RequestWorkbench />
              </section>
              
              {/* Right Workspace */}
              <section className="flex flex-col h-full bg-[#13131a]" style={{ width: '55%' }}>
                <ResponsePanel />
              </section>
            </div>
          </main>
        </div>
      </div>
    </RequestProvider>
  );
}
