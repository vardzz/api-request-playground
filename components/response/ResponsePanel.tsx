'use client';

import { useState } from 'react';
import { useRequestState } from '../../context/RequestContext';
import StatusBadge from './StatusBadge';
import MetaBar from './MetaBar';
import JsonViewer from './JsonViewer';
import HeadersInspector from './HeadersInspector';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ResponsePanel() {
  const state = useRequestState();
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

  const { response, isLoading } = state;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-transparent border-none">
        <Loader2 size={32} className="animate-spin text-purple-500 mb-4" />
        <p className="text-zinc-400 font-medium text-sm animate-pulse">Awaiting Response...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-transparent border-none">
        <h2 className="text-xl font-heading font-semibold text-zinc-100 mb-2 tracking-tight">No Response Yet</h2>
        <p className="text-sm text-zinc-400 max-w-xs text-center">
          Send your first request to inspect the server response.
        </p>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-transparent border-none p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-heading font-bold text-zinc-100 mb-3 tracking-tight">Network Request Failed</h3>
        
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-md p-4 text-left max-w-sm w-full mb-6">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Possible Causes</p>
          <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-4">
            <li>CORS misconfiguration</li>
            <li>DNS resolution failed</li>
            <li>Connection timeout</li>
            <li>You are offline</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-transparent border-none overflow-hidden h-full">
      {/* Top Bar: Status & Metadata */}
      <div className="flex items-center justify-between p-4 bg-transparent border-b border-[#F4F1EA]/20">
        <StatusBadge status={response.status} statusText={response.statusText} />
        <MetaBar timeMs={response.timeMs} sizeBytes={response.sizeBytes} />
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 pt-2 border-b border-[#F4F1EA]/20 bg-transparent">
        {[
          { id: 'body', label: 'Response Body' },
          { id: 'headers', label: 'Headers', count: Object.keys(response.headers).length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 text-sm transition-colors border-b-2 -mb-[1px] flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-[#F4F1EA] text-[#F4F1EA] font-medium'
                : 'border-transparent text-[#F4F1EA]/50 hover:text-[#F4F1EA]'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${activeTab === tab.id ? 'bg-[#0F1115] text-[#F4F1EA]' : 'bg-transparent text-[#F4F1EA]/50'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4 bg-transparent flex-1 overflow-hidden h-full relative">
        {activeTab === 'body' && (
          <div className="h-full w-full rounded-xl overflow-hidden bg-[#0F1115] border border-[#F4F1EA]/20">
            <JsonViewer data={response.data} />
          </div>
        )}
        {activeTab === 'headers' && (
          <div className="h-full overflow-y-auto">
            <HeadersInspector headers={response.headers} />
          </div>
        )}
      </div>
    </div>
  );
}