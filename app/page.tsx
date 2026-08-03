'use client';

import { RequestProvider } from '../context/RequestContext';
import RequestWorkbench from '../components/workbench/RequestWorkbench';
import ResponsePanel from '../components/response/ResponsePanel';
import HistorySidebar from '../components/history/HistorySidebar';
import { Triangle, Search, Settings2, Plus } from 'lucide-react';

export default function Home() {
  return (
    <RequestProvider>
      <div className="flex flex-col h-screen overflow-hidden font-sans bg-background text-secondary-text">
        {/* Global Header */}
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 flex-shrink-0 z-20">
          
          {/* Left: Branding */}
          <div className="flex items-center gap-3 w-[22%]">
            <Triangle size={20} className="text-primary-text fill-primary-text" />
            <h1 className="text-lg font-heading font-semibold tracking-tight text-primary-text">Apex</h1>
            <span className="hidden md:inline-flex items-center rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-secondary-text border border-border">
              Workspace
            </span>
          </div>

          {/* Center: Global Search */}
          <div className="flex-1 max-w-[500px] mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="w-full bg-surface border border-transparent rounded-md py-1.5 pl-9 pr-14 text-sm text-primary-text placeholder:text-muted-text focus:outline-none focus:border-border transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-xs font-mono text-muted-text bg-background border border-border rounded px-1.5 py-0.5">Ctrl</span>
                <span className="text-xs font-mono text-muted-text bg-background border border-border rounded px-1.5 py-0.5">K</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 w-[35%]">
            <button className="hidden sm:flex items-center gap-1.5 bg-transparent border border-border hover:bg-surface text-primary-text px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
              <Plus size={16} />
              <span>New</span>
            </button>
            <button className="p-1.5 text-muted-text hover:text-primary-text transition-colors">
              <Settings2 size={18} />
            </button>
            <div className="w-7 h-7 rounded-full bg-transparent border border-border flex items-center justify-center text-xs font-medium text-primary-text cursor-pointer hover:border-secondary-text transition-colors">
              U
            </div>
          </div>
        </header>

        {/* Main Application Area */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row bg-background">
          {/* History Sidebar */}
          <div className="hidden md:flex flex-col h-full border-r border-border" style={{ width: '22%' }}>
            <HistorySidebar />
          </div>
          
          <main className="flex-1 flex overflow-hidden">
            <div className="w-full flex">
              {/* Left Workspace */}
              <section className="flex flex-col h-full border-r border-border bg-background" style={{ width: '45%' }}>
                <RequestWorkbench />
              </section>
              
              {/* Right Workspace */}
              <section className="flex flex-col h-full bg-background" style={{ width: '55%' }}>
                <ResponsePanel />
              </section>
            </div>
          </main>
        </div>
      </div>
    </RequestProvider>
  );
}
