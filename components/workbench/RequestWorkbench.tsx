'use client';

import { useState } from 'react';
import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import MethodSelector from './MethodSelector';
import UrlBar from './UrlBar';
import KeyValueEditor from './KeyValueEditor';
import BodyEditor from './BodyEditor';
import { Play, Save, Settings2, Send } from 'lucide-react';
import { KeyValuePair } from '../../types';
import { useSendRequest } from '../../hooks/useSendRequest';

export default function RequestWorkbench() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();
  const { sendRequest } = useSendRequest();
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'auth' | 'body' | 'cookies'>('headers');

  return (
    <div className="flex flex-col h-full bg-transparent relative border-none">
      
      {/* Top Toolbar */}
      <div className="p-4 flex items-center gap-3">
        <div className="flex-1 flex items-center bg-[#0F1115] border border-[#F4F1EA]/20 rounded-xl p-1 h-12 shadow-sm min-w-0">
          <MethodSelector />
          <div className="w-px h-6 bg-[#F4F1EA]/20 mx-2" />
          <UrlBar />
        </div>
        
        <button 
          onClick={sendRequest}
          disabled={state.isLoading}
          className="h-12 flex items-center justify-center gap-2 px-5 bg-[#F4F1EA] hover:bg-[#F4F1EA]/80 text-[#0F1115] rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
        >
          <Send size={16} className={state.isLoading ? 'animate-pulse' : ''} />
          <span>Send</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 pt-2 border-b border-[#F4F1EA]/20">
        {[
          { id: 'params', label: 'Params', count: state.request.params.filter(p => p.key).length },
          { id: 'headers', label: 'Headers', count: state.request.headers.filter(h => h.key).length },
          { id: 'body', label: 'Body', count: 0 }
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
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${activeTab === tab.id ? 'bg-[#F4F1EA]/20 text-[#F4F1EA]' : 'bg-transparent text-[#F4F1EA]/50'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-transparent">
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
            <p className="text-xs text-zinc-500 mt-3 text-center">
              Body is typically omitted for GET or HEAD requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}