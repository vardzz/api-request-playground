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
      <div className="flex flex-col items-center justify-center h-full bg-background m-3 rounded-card shadow-subtle border border-border">
        <Loader2 size={32} className="animate-spin text-accent mb-4" />
        <p className="text-secondary-text font-medium text-sm animate-pulse">Awaiting Response...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background m-3 rounded-card border-2 border-dashed border-border/60">
        <div className="w-16 h-16 rounded-full bg-elevated border border-border flex items-center justify-center mb-6 shadow-sm">
          <SendHorizontal size={24} className="text-muted-text -ml-1" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-primary-text mb-2 tracking-tight">No Response Yet</h2>
        <p className="text-sm text-secondary-text max-w-xs text-center">
          Send your first request to inspect the server response.
        </p>
        <button className="mt-6 px-4 py-2 bg-elevated hover:bg-elevated/80 border border-border rounded-button text-sm font-medium text-primary-text transition-colors click-scale shadow-sm">
          Learn More
        </button>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background m-3 rounded-card shadow-subtle border border-border p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-6">
          <AlertCircle size={28} className="text-danger" />
        </div>
        <h3 className="text-lg font-heading font-bold text-primary-text mb-3 tracking-tight">Network Request Failed</h3>
        
        <div className="bg-elevated border border-border rounded-card p-4 text-left max-w-sm w-full mb-6">
          <p className="text-xs text-muted-text uppercase tracking-wider font-semibold mb-2">Possible Causes</p>
          <ul className="text-sm text-secondary-text space-y-2 list-disc pl-4">
            <li>CORS misconfiguration</li>
            <li>DNS resolution failed</li>
            <li>Connection timeout</li>
            <li>You are offline</li>
          </ul>
        </div>
        
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-primary-text text-sm font-medium rounded-button transition-colors click-scale shadow-sm">
            Retry
          </button>
          <button className="px-5 py-2.5 bg-elevated hover:bg-elevated/80 border border-border text-primary-text text-sm font-medium rounded-button transition-colors click-scale shadow-sm">
            View Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background rounded-card shadow-subtle border border-border overflow-hidden h-full m-3">
      {/* Top Bar: Status & Metadata */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface/80 backdrop-blur-md">
        <StatusBadge status={response.status} statusText={response.statusText} />
        <MetaBar timeMs={response.timeMs} sizeBytes={response.sizeBytes} />
      </div>

      {/* Tabs (Segmented Controls) */}
      <div className="px-4 py-3 border-b border-border bg-surface">
        <div className="flex bg-elevated p-1 rounded-card border border-border shadow-sm inline-flex">
          {[
            { id: 'body', label: 'Body' },
            { id: 'headers', label: 'Headers', count: Object.keys(response.headers).length },
            { id: 'cookies', label: 'Cookies' },
            { id: 'raw', label: 'Raw' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 text-xs font-medium rounded-input transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-surface text-primary-text shadow-sm'
                  : 'text-muted-text hover:text-secondary-text hover:bg-surface/50'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 text-[10px] rounded-pill font-mono ${activeTab === tab.id ? 'bg-accent/20 text-accent' : 'bg-background border border-border text-muted-text'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-0 bg-background flex-1 overflow-hidden">
        {activeTab === 'body' && <JsonViewer data={response.data} />}
        {activeTab === 'headers' && (
          <div className="p-4 h-full overflow-y-auto">
            <HeadersInspector headers={response.headers} />
          </div>
        )}
        {['cookies', 'raw'].includes(activeTab) && (
          <div className="h-full flex flex-col items-center justify-center text-muted-text border-2 border-dashed border-border rounded-card m-4 opacity-70">
            <LayoutPanelTop size={32} className="mb-3 opacity-50" />
            <p className="text-sm">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}