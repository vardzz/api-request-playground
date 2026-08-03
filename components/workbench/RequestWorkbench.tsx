'use client';

import { useState } from 'react';
import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import MethodSelector from './MethodSelector';
import UrlBar from './UrlBar';
import KeyValueEditor from './KeyValueEditor';
import BodyEditor from './BodyEditor';
import { Play, Save, Settings2 } from 'lucide-react';
import { KeyValuePair } from '../../types';

export default function RequestWorkbench() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'auth' | 'body' | 'cookies'>('headers');

  return (
    <div className="flex flex-col h-full bg-background relative border-none">
      
      {/* Top Toolbar */}
      <div className="p-4 flex items-center gap-3">
        <div className="flex-1 flex items-center bg-surface border border-border rounded-md shadow-sm h-[42px]">
          <MethodSelector />
          <div className="w-px h-6 bg-border" />
          <UrlBar />
        </div>
        
        <button 
          className="w-[42px] h-[42px] flex items-center justify-center bg-surface hover:bg-elevated border border-border rounded-md text-secondary-text transition-colors click-scale flex-shrink-0"
          title="Save Request"
        >
          <Save size={18} />
        </button>
        
        <button 
          onClick={() => dispatch({ type: 'SEND_REQUEST' })}
          disabled={state.isLoading}
          className="h-[42px] flex items-center justify-center gap-2 px-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-md font-medium transition-colors click-scale disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Play size={16} className={state.isLoading ? 'animate-pulse' : 'ml-0.5'} fill="currentColor" />
          <span>Send</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 pt-2 border-b border-border">
        {[
          { id: 'params', label: 'Params', count: state.request.params.filter(p => p.key).length },
          { id: 'headers', label: 'Headers', count: state.request.headers.filter(h => h.key).length },
          { id: 'auth', label: 'Authorization', count: 0 },
          { id: 'body', label: 'Body', count: 0 },
          { id: 'cookies', label: 'Cookies', count: 0 }
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
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-mono ${activeTab === tab.id ? 'bg-surface border border-border text-primary-text' : 'bg-surface border border-transparent text-secondary-text'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
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
            <div className="flex-1 min-h-[300px]">
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