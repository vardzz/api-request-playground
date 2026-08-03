'use client';

import { useState } from 'react';
import { useRequestState } from '../../context/RequestContext';
import StatusBadge from './StatusBadge';
import MetaBar from './MetaBar';
import JsonViewer from './JsonViewer';
import HeadersInspector from './HeadersInspector';
import { Loader2, AlertCircle, SendHorizontal, LayoutPanelTop } from 'lucide-react';

export default function ResponsePanel() {
  const state = useRequestState();
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'cookies' | 'raw'>('body');

  const { response, isLoading } = state;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background border-none">
        <Loader2 size={32} className="animate-spin text-accent mb-4" />
        <p className="text-secondary-text font-medium text-sm animate-pulse">Awaiting Response...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background border-none">
        <h2 className="text-xl font-heading font-semibold text-primary-text mb-2 tracking-tight">No Response Yet</h2>
        <p className="text-sm text-secondary-text max-w-xs text-center">
          Send your first request to inspect the server response.
        </p>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background border-none p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-6">
          <AlertCircle size={28} className="text-danger" />
        </div>
        <h3 className="text-lg font-heading font-bold text-primary-text mb-3 tracking-tight">Network Request Failed</h3>
        
        <div className="bg-surface border border-border rounded-md p-4 text-left max-w-sm w-full mb-6">
          <p className="text-xs text-muted-text uppercase tracking-wider font-semibold mb-2">Possible Causes</p>
          <ul className="text-sm text-secondary-text space-y-2 list-disc pl-4">
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
    <div className="flex flex-col bg-background border-none overflow-hidden h-full">
      {/* Top Bar: Status & Metadata */}
      <div className="flex items-center justify-between p-4 bg-background">
        <StatusBadge status={response.status} statusText={response.statusText} />
        <MetaBar timeMs={response.timeMs} sizeBytes={response.sizeBytes} />
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 pt-2 border-b border-border bg-background">
        {[
          { id: 'body', label: 'Response Body' },
          { id: 'headers', label: 'Headers', count: Object.keys(response.headers).length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-[13px] font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-[#8B5CF6] text-primary-text'
                : 'border-transparent text-secondary-text hover:text-primary-text'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-mono ${activeTab === tab.id ? 'bg-surface border border-border text-primary-text' : 'bg-surface border border-transparent text-secondary-text'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-0 bg-background flex-1 overflow-hidden">
        {activeTab === 'body' && <JsonViewer data={response.data} />}
        {activeTab === 'headers' && (
          <div className="p-4 h-full overflow-y-auto">
            <HeadersInspector headers={response.headers} />
          </div>
        )}
      </div>
    </div>
  );
}