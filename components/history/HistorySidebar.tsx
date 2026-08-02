'use client';

import { useHistory } from '../../hooks/useHistory';
import { useRequestDispatch } from '../../context/RequestContext';
import HistoryItem from './HistoryItem';
import { History, Trash2 } from 'lucide-react';

export default function HistorySidebar() {
  const { history, clearHistory } = useHistory();
  const dispatch = useRequestDispatch();

  return (
    <div className="flex flex-col bg-white border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-80 h-48 md:h-full flex-shrink-0 z-10 shadow-sm md:shadow-none">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <History size={18} />
          <h2>History</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Clear history"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">
            No requests yet. Send a request to save it to history.
          </div>
        ) : (
          <div className="flex flex-col">
            {history.map((entry) => (
              <HistoryItem 
                key={entry.id} 
                entry={entry} 
                onClick={() => dispatch({ type: 'LOAD_FROM_HISTORY', payload: entry })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}