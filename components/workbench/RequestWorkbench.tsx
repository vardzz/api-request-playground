'use client';

import { useState, useEffect } from 'react';
import MethodSelector from './MethodSelector';
import UrlBar from './UrlBar';
import KeyValueEditor from './KeyValueEditor';
import BodyEditor from './BodyEditor';
import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { useSendRequest } from '../../hooks/useSendRequest';
import { KeyValuePair } from '../../types';
import { Send, Settings2, Loader2, Save } from 'lucide-react';

export default function RequestWorkbench() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();
  const { sendRequest } = useSendRequest();
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'auth' | 'body' | 'cookies'>('params');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!state.isLoading) {
          sendRequest();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sendRequest, state.isLoading]);

  return (
    <div className="flex flex-col bg-background rounded-card shadow-subtle border border-border overflow-hidden h-full m-3">
      {/* Top Bar: Method & URL */}
      <div className="p-3 border-b border-border bg-surface/80 flex items-center gap-3 backdrop-blur-md">
        <div className="flex-1 flex items-center bg-elevated border border-border rounded-input p-1 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all shadow-sm">
          <MethodSelector />
          <div className="w-px h-6 bg-border mx-1" />
          <UrlBar />
        </div>
        <button
          className="flex items-center justify-center p-2.5 text-muted-text hover:text-primary-text bg-elevated border border-border hover:border-border/80 rounded-button transition-colors click-scale shadow-sm"
          title="Save Request (Ctrl + S)"
        >
          <Save size={18} />
        </button>
        <button
          onClick={sendRequest}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-primary-text text-sm font-medium rounded-button shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors click-scale relative overflow-hidden group"
          disabled={state.isLoading}
          title="Send Request (Ctrl + Enter)"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center gap-2">
            {state.isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            <span className="hidden sm:inline font-semibold tracking-wide">{state.isLoading ? 'Sending' : 'Send'}</span>
          </span>
        </button>
      </div>

      {/* Tabs (Segmented Controls) */}
      <div className="px-4 py-3 border-b border-border bg-surface">
        <div className="flex bg-elevated p-1 rounded-card border border-border shadow-sm inline-flex">
          {[
            { id: 'params', label: 'Params', count: state.request.params.filter(p => p.key).length },
            { id: 'headers', label: 'Headers', count: state.request.headers.filter(h => h.key).length },
            { id: 'auth', label: 'Authorization', count: 0 },
            { id: 'body', label: 'Body', indicator: state.request.body.length > 0 },
            { id: 'cookies', label: 'Cookies', count: 0 },
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
              {tab.count ? (
                <span className={`px-1.5 py-0.5 text-[10px] rounded-pill font-mono ${activeTab === tab.id ? 'bg-accent/20 text-accent' : 'bg-background border border-border text-muted-text'}`}>
                  {tab.count}
                </span>
              ) : null}
              {tab.indicator && (
                <span className={`w-1.5 h-1.5 rounded-full ${state.request.bodyIsValidJson ? 'bg-success' : 'bg-danger'}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 bg-background flex-1 overflow-y-auto">
        {activeTab === 'params' && (
          <div className="space-y-4 max-w-4xl">
            <KeyValueEditor
              items={state.request.params}
              onAdd={(item: KeyValuePair) => dispatch({ type: 'ADD_PARAM', payload: item })}
              onUpdate={(item: KeyValuePair) => dispatch({ type: 'UPDATE_PARAM', payload: item })}
              onRemove={(id: string) => dispatch({ type: 'REMOVE_PARAM', payload: id })}
              placeholderKey="New parameter"
              placeholderValue="Value"
            />
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-4 max-w-4xl">
            <KeyValueEditor
              items={state.request.headers}
              onAdd={(item: KeyValuePair) => dispatch({ type: 'ADD_HEADER', payload: item })}
              onUpdate={(item: KeyValuePair) => dispatch({ type: 'UPDATE_HEADER', payload: item })}
              onRemove={(id: string) => dispatch({ type: 'REMOVE_HEADER', payload: id })}
              placeholderKey="New header"
              placeholderValue="Value"
            />
          </div>
        )}

        {activeTab === 'body' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 min-h-[300px] border border-border rounded-card overflow-hidden">
              <BodyEditor />
            </div>
            <p className="text-xs text-muted-text mt-3 text-center">
              Body is typically omitted for GET or HEAD requests.
            </p>
          </div>
        )}

        {['auth', 'cookies'].includes(activeTab) && (
          <div className="h-full flex flex-col items-center justify-center text-muted-text border-2 border-dashed border-border rounded-card m-4 opacity-70">
            <Settings2 size={32} className="mb-3 opacity-50" />
            <p className="text-sm">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} configuration coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}