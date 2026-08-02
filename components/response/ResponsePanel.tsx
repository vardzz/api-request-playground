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
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white rounded-lg shadow-sm border border-gray-200">
        <Loader2 size={32} className="animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 font-medium">Executing Request...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
        <Inbox size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No response yet</p>
        <p className="text-sm text-gray-400 mt-1">Send a request to see the results here.</p>
      </div>
    );
  }

  // Pitfall #1: Explicit network/CORS error display distinctly from an HTTP error response
  if (response.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-red-50 rounded-lg shadow-sm border border-red-200 p-6 text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-red-800 mb-2">Network Request Failed</h3>
        <p className="text-sm text-red-600 max-w-md">{response.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
      {/* Top Bar: Status & Metadata */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <StatusBadge status={response.status} statusText={response.statusText} />
        <MetaBar timeMs={response.timeMs} sizeBytes={response.sizeBytes} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 pt-2 gap-6 bg-gray-50/50">
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'body'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('body')}
        >
          Response Body
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
          {Object.keys(response.headers).length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-700 rounded-full">
              {Object.keys(response.headers).length}
            </span>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 bg-white flex-1 overflow-y-auto">
        {activeTab === 'body' && <JsonViewer data={response.data} />}
        {activeTab === 'headers' && <HeadersInspector headers={response.headers} />}
      </div>
    </div>
  );
}