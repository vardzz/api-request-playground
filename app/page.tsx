'use client';

import { RequestProvider } from '../context/RequestContext';
import RequestWorkbench from '../components/workbench/RequestWorkbench';
import ResponsePanel from '../components/response/ResponsePanel';
import HistorySidebar from '../components/history/HistorySidebar';
import { PanelLeft } from 'lucide-react';
import { useState } from 'react';
import GlobalSearch from '../components/search/GlobalSearch';
import Image from 'next/image';
import apexLogo from './logo.png';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <RequestProvider>
      <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#0F1115] text-[#F4F1EA]">
        {/* Global Header */}
        <header className="h-14 border-b border-[#F4F1EA]/20 bg-[#0F1115] flex items-center justify-between px-4 flex-shrink-0 z-20">
          
          {/* Left: Branding */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Image src={apexLogo} alt="Apex Logo" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-heading font-bold tracking-tight text-[#F4F1EA]">Apex</h1>
            <span className="hidden md:inline-flex items-center rounded bg-[#0F1115] px-2 py-0.5 text-xs font-medium text-[#F4F1EA] border border-[#F4F1EA]/20 ml-1">
              Workspace
            </span>
          </div>

          {/* Center: Global Search */}
          <GlobalSearch />

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 flex-1">
          </div>
        </header>

        {/* Main Application Area */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row bg-[#0F1115]">
          {/* History Sidebar */}
          <div 
            className="hidden md:flex flex-col h-full border-[#F4F1EA]/20 bg-[#0F1115] transition-all duration-300 ease-in-out relative" 
            style={{ 
              width: isSidebarOpen ? '22%' : '48px',
              minWidth: isSidebarOpen ? '250px' : '48px',
              borderRightWidth: '1px',
              overflow: 'hidden'
            }}
          >
            <div className={`w-[22vw] min-w-[250px] h-full transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <HistorySidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
            
            {!isSidebarOpen && (
              <div className="absolute top-0 left-0 w-[48px] h-full flex flex-col items-center pt-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1.5 hover:bg-[#F4F1EA]/10 rounded-md transition-colors text-[#F4F1EA]/70 hover:text-[#F4F1EA]"
                  title="Open Sidebar"
                >
                  <PanelLeft size={18} />
                </button>
              </div>
            )}
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
