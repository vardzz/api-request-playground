'use client';

import { RequestProvider } from '../context/RequestContext';
import RequestWorkbench from '../components/workbench/RequestWorkbench';
import ResponsePanel from '../components/response/ResponsePanel';
import HistorySidebar from '../components/history/HistorySidebar';
import { Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import apexLogo from './apex-logo.png';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <RequestProvider>
      <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#0F1115] text-[#F4F1EA]">
        {/* Global Header */}
        <header className="h-14 border-b border-[#F4F1EA]/20 bg-[#0F1115] flex items-center justify-between px-4 flex-shrink-0 z-20">
          
          {/* Left: Branding */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <Image src={apexLogo} alt="Apex Logo" fill className="object-contain scale-110" />
            </div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-[#F4F1EA]">Apex</h1>
            <span className="hidden md:inline-flex items-center rounded bg-[#0F1115] px-2 py-0.5 text-xs font-medium text-[#F4F1EA] border border-[#F4F1EA]/20 ml-1">
              Workspace
            </span>
          </div>

          {/* Center: Global Search */}
          <div className="w-full max-w-[500px] px-4">
            <div className="relative group">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-[#F4F1EA]/50" size={16} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search requests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F1115] border border-[#F4F1EA]/20 rounded-lg py-1.5 pl-10 pr-14 text-sm text-[#F4F1EA] placeholder:text-[#F4F1EA]/50 focus:outline-none focus:border-[#F4F1EA] transition-all"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-xs font-mono text-[#F4F1EA] bg-[#0F1115] border border-[#F4F1EA]/20 rounded px-1.5 py-0.5">Ctrl K</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 flex-1">
          </div>
        </header>

        {/* Main Application Area */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row bg-[#0F1115]">
          {/* History Sidebar */}
          <div className="hidden md:flex flex-col h-full border-r border-[#F4F1EA]/20 bg-[#0F1115]" style={{ width: '22%' }}>
            <HistorySidebar searchQuery={searchQuery} />
          </div>
          
          <main className="flex-1 flex overflow-hidden">
            <div className="w-full flex">
              {/* Left Workspace */}
              <section className="flex flex-col h-full border-r border-[#F4F1EA]/20 bg-[#0F1115]" style={{ width: '45%' }}>
                <RequestWorkbench />
              </section>
              
              {/* Right Workspace */}
              <section className="flex flex-col h-full bg-[#0F1115]" style={{ width: '55%' }}>
                <ResponsePanel />
              </section>
            </div>
          </main>
        </div>
      </div>
    </RequestProvider>
  );
}
