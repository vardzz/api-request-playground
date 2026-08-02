'use client';

import { useHistory } from '../../hooks/useHistory';
import { useRequestDispatch } from '../../context/RequestContext';
import HistoryItem from './HistoryItem';
import { History, Trash2 } from 'lucide-react';

export default function HistorySidebar() {
  const { history, clearHistory } = useHistory();
  const dispatch = useRequestDispatch();

  return (
    <div className="flex flex-col bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 w-full md:w-[260px] h-48 md:h-full flex-shrink-0 z-10">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-sm">
          <History size={16} />
          <h2>History</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            title="Clear history"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {history.length === 0 ? (
          <div className="p-6 text-center text-sm text-zinc-500">
            No requests yet. Send a request to save it.
          </div>
        ) : (
          <div className="flex flex-col p-2 gap-1">
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