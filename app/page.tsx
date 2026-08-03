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
        <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 flex-shrink-0 z-20">
          
          {/* Left: Branding */}
          <div className="flex items-center gap-3 w-[22%]">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Triangle size={18} className="fill-accent" />
            </div>
            <h1 className="text-lg font-heading font-semibold tracking-tight text-primary-text">Apex</h1>
            <span className="hidden md:inline-flex items-center rounded-pill bg-elevated border border-border px-2 py-0.5 text-xs font-medium text-muted-text">
              Workspace
            </span>
          </div>

          {/* Center: Global Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-accent transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="w-full bg-elevated border border-border rounded-input py-1.5 pl-9 pr-4 text-sm text-primary-text placeholder:text-muted-text focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all shadow-sm hover:border-border/80"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="hidden sm:inline-flex items-center justify-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-text">Ctrl</kbd>
                <kbd className="hidden sm:inline-flex items-center justify-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-text">K</kbd>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 w-[35%]">
            <button className="hidden sm:flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary-text px-3 py-1.5 rounded-button text-sm font-medium transition-colors shadow-sm click-scale">
              <Plus size={16} />
              <span>New</span>
            </button>
            <button className="p-1.5 text-muted-text hover:text-primary-text rounded-button hover:bg-elevated transition-colors">
              <Settings2 size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center text-xs font-medium text-primary-text cursor-pointer hover:border-accent transition-colors">
              U
            </div>
          </div>
        </header>

        {/* Main Application Area */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row bg-background">
          {/* History Sidebar (22%) */}
          <div className="hidden md:flex flex-col h-full border-r border-border" style={{ width: '22%' }}>
            <HistorySidebar />
          </div>
          
          <main className="flex-1 flex overflow-hidden">
            <div className="w-full flex">
              {/* Left Workspace (43%) */}
              <section className="flex flex-col h-full border-r border-border bg-background" style={{ width: '55.12%' /* 43 / (43+35) */ }}>
                <RequestWorkbench />
              </section>
              
              {/* Right Workspace (35%) */}
              <section className="flex flex-col h-full bg-background" style={{ width: '44.88%' /* 35 / (43+35) */ }}>
                <ResponsePanel />
              </section>
            </div>
          </main>
        </div>
      </div>
    </RequestProvider>
  );
}
