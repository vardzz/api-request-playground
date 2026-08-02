'use client';

import { RequestProvider } from '../context/RequestContext';
import RequestWorkbench from '../components/workbench/RequestWorkbench';
import ResponsePanel from '../components/response/ResponsePanel';
import HistorySidebar from '../components/history/HistorySidebar';

export default function Home() {
  return (
    <RequestProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
        <HistorySidebar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">API Request Playground</h1>
              <p className="text-gray-500 mt-1">AI-assisted API client with strict state management</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="flex flex-col gap-6">
                <RequestWorkbench />
              </section>
              
              <section className="flex flex-col h-full min-h-[500px]">
                <ResponsePanel />
              </section>
            </div>
          </div>
        </main>
      </div>
    </RequestProvider>
  );
}
