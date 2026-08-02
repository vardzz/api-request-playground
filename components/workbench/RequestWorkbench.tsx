'use client';

import { useState, useEffect } from 'react';
import MethodSelector from './MethodSelector';
import UrlBar from './UrlBar';
import KeyValueEditor from './KeyValueEditor';
import BodyEditor from './BodyEditor';
import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { useSendRequest } from '../../hooks/useSendRequest';
import { KeyValuePair } from '../../types';
import { Send, Settings2, Loader2 } from 'lucide-react';

export default function RequestWorkbench() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();
  const { sendRequest } = useSendRequest();
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');

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
    <div className="flex flex-col bg-zinc-950 rounded-lg shadow border border-zinc-800 overflow-hidden h-full">
      {/* Top Bar: Method & URL */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 focus-within:ring-1 focus-within:ring-indigo-500 transition-shadow">
            <MethodSelector />
            <UrlBar />
          </div>
          <button
            onClick={sendRequest}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={state.isLoading}
          >
            {state.isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            <span className="hidden sm:inline">{state.isLoading ? 'Sending' : 'Send'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 px-3 pt-2 gap-6 bg-zinc-950">
        <button
          className={`pb-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'params'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          onClick={() => setActiveTab('params')}
        >
          <Settings2 size={14} />
          Params
          {state.request.params.filter(p => p.key).length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-zinc-800 text-zinc-400 rounded">
              {state.request.params.filter(p => p.key).length}
            </span>
          )}
        </button>
        <button
          className={`pb-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'headers'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
          {state.request.headers.filter(h => h.key).length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-zinc-800 text-zinc-400 rounded">
              {state.request.headers.filter(h => h.key).length}
            </span>
          )}
        </button>
        <button
          className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'body'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          onClick={() => setActiveTab('body')}
        >
          Body
          {state.request.body.length > 0 && (
            <span className={`ml-2 inline-block w-2 h-2 rounded-full ${state.request.bodyIsValidJson ? 'bg-emerald-500' : 'bg-red-500'}`} />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3 bg-zinc-950 flex-1 overflow-y-auto">
        {activeTab === 'params' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
              <Settings2 size={16} />
              <h3 className="font-semibold">Query Parameters</h3>
            </div>
            <KeyValueEditor
              items={state.request.params}
              onAdd={(item: KeyValuePair) => dispatch({ type: 'ADD_PARAM', payload: item })}
              onUpdate={(item: KeyValuePair) => dispatch({ type: 'UPDATE_PARAM', payload: item })}
              onRemove={(id: string) => dispatch({ type: 'REMOVE_PARAM', payload: id })}
            />
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
              <Settings2 size={16} />
              <h3 className="font-semibold">Request Headers</h3>
            </div>
            <KeyValueEditor
              items={state.request.headers}
              onAdd={(item: KeyValuePair) => dispatch({ type: 'ADD_HEADER', payload: item })}
              onUpdate={(item: KeyValuePair) => dispatch({ type: 'UPDATE_HEADER', payload: item })}
              onRemove={(id: string) => dispatch({ type: 'REMOVE_HEADER', payload: id })}
            />
          </div>
        )}

        {activeTab === 'body' && (
          <div className="h-full">
            <BodyEditor />
            <p className="text-xs text-zinc-500 mt-2">
              Body is typically omitted for GET or HEAD requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}