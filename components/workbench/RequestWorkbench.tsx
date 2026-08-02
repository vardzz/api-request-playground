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
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Top Bar: Method & URL */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 shadow-sm rounded-md">
          <MethodSelector />
          <UrlBar />
        </div>
        <button
          onClick={sendRequest}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={state.isLoading}
        >
          {state.isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {state.isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 pt-2 gap-6 bg-gray-50/50">
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'params'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('params')}
        >
          Query Params
          {state.request.params.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-700 rounded-full">
              {state.request.params.length}
            </span>
          )}
        </button>
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'headers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
          {state.request.headers.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-700 rounded-full">
              {state.request.headers.length}
            </span>
          )}
        </button>
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'body'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('body')}
        >
          Body
          {state.request.body.length > 0 && (
            <span className={`ml-2 inline-block w-2 h-2 rounded-full ${state.request.bodyIsValidJson ? 'bg-green-500' : 'bg-red-500'}`} />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 bg-white min-h-[300px]">
        {activeTab === 'params' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
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
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
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
            <p className="text-xs text-gray-400 mt-2">
              Body is typically omitted for GET or HEAD requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}