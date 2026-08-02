'use client';

import { useState } from 'react';
import { useRequestState } from '../../context/RequestContext';
import StatusBadge from './StatusBadge';
import MetaBar from './MetaBar';
import JsonViewer from './JsonViewer';
import HeadersInspector from './HeadersInspector';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export default function ResponsePanel() {
  const state = useRequestState();
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

  const { response, isLoading } = state;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-zinc-950 rounded-lg shadow border border-zinc-800">
        <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
        <p className="text-zinc-400 font-medium text-sm">Executing Request...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-zinc-950 rounded-lg shadow border border-dashed border-zinc-800">
        <Inbox size={48} className="text-zinc-700 mb-4" />
        <p className="text-zinc-400 font-medium">No response yet</p>
        <p className="text-sm text-zinc-600 mt-1">Send a request to see the results here.</p>
      </div>
    );
  }

  // Pitfall #1: Explicit network/CORS error display distinctly from an HTTP error response
  if (response.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-red-950/30 rounded-lg shadow border border-red-900/50 p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-400 mb-2">Network Request Failed</h3>
        <p className="text-sm text-red-300 max-w-md">{response.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-zinc-950 rounded-lg shadow border border-zinc-800 overflow-hidden h-full">
      {/* Top Bar: Status & Metadata */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900/50">
        <StatusBadge status={response.status} statusText={response.statusText} />
        <MetaBar timeMs={response.timeMs} sizeBytes={response.sizeBytes} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 px-3 pt-2 gap-6 bg-zinc-950">
        <button
          className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'body'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          onClick={() => setActiveTab('body')}
        >
          Response Body
        </button>
        <button
          className={`pb-2.5 text-xs font-medium border-b-2 transition-colors flex items-center ${
            activeTab === 'headers'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
          {Object.keys(response.headers).length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-zinc-800 text-zinc-400 rounded">
              {Object.keys(response.headers).length}
            </span>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3 bg-zinc-950 flex-1 overflow-y-auto">
        {activeTab === 'body' && <JsonViewer data={response.data} />}
        {activeTab === 'headers' && <HeadersInspector headers={response.headers} />}
      </div>
    </div>
  );
}