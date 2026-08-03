'use client';

import { useHistory } from '../../hooks/useHistory';
import { useRequestDispatch } from '../../context/RequestContext';
import HistoryItem from './HistoryItem';
import { Clock } from 'lucide-react';
import { HistoryEntry } from '../../types';
import { storage } from '../../lib/storage';

interface HistorySidebarProps {
  searchQuery?: string;
}

export default function HistorySidebar({ searchQuery = '' }: HistorySidebarProps) {
  const { history } = useHistory();
  const dispatch = useRequestDispatch();

  const groupHistory = (items: HistoryEntry[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const grouped: { [key: string]: HistoryEntry[] } = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };

    const query = searchQuery.toLowerCase().trim();

    items.forEach(item => {
      // Search filtering
      if (query) {
        const urlMatch = item.request.url.toLowerCase().includes(query);
        const methodMatch = item.request.method.toLowerCase().includes(query);
        const statusMatch = item.responseSummary.status.toString().includes(query);
        
        // Also check inside query params and headers
        const paramsMatch = item.request.params.some(p => p.enabled && (p.key.toLowerCase().includes(query) || p.value.toLowerCase().includes(query)));
        const headersMatch = item.request.headers.some(h => h.enabled && (h.key.toLowerCase().includes(query) || h.value.toLowerCase().includes(query)));
        
        if (!urlMatch && !methodMatch && !statusMatch && !paramsMatch && !headersMatch) {
          return; // skip this item
        }
      }

      const date = new Date(item.timestamp);
      if (date >= today) grouped['Today'].push(item);
      else if (date >= yesterday) grouped['Yesterday'].push(item);
      else grouped['Earlier'].push(item);
    });

    return grouped;
  };

  const groupedHistory = groupHistory(history);

  return (
    <div className="flex flex-col bg-transparent w-full h-full flex-shrink-0 z-10 border-none relative">
      {/* Header */}
      <div className="flex items-center px-4 pt-4 border-b border-zinc-800/60">
        <div className="flex items-center justify-center gap-2 py-2 px-2 text-[13px] font-medium border-b-2 -mb-[1px] border-purple-500 text-zinc-100">
          <Clock size={16} /> History
        </div>
      </div>

      <div className="px-3 py-2 flex items-center justify-between mt-2">
        <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">RECENT REQUESTS</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4">
        {history.length === 0 ? (
          <div className="p-6 text-center text-sm text-zinc-400 font-medium flex flex-col items-center gap-3 mt-20">
            <div className="text-zinc-500 bg-zinc-900/50 p-3 rounded-full">
              <Clock size={24} />
            </div>
            <p>No requests yet.<br/>Send a request to see it here.</p>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([group, items]) => (
            items.length > 0 && (
              <div key={group} className="flex flex-col gap-1.5">
                <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{group}</h3>
                <div className="flex flex-col gap-1">
                  {items.map((entry) => (
                    <HistoryItem 
                      key={entry.id} 
                      entry={entry} 
                      onClick={() => dispatch({ type: 'LOAD_FROM_HISTORY', payload: entry })}
                      onDelete={() => {
                        const newHistory = history.filter(h => h.id !== entry.id);
                        storage.set('api_playground_history', newHistory);
                        dispatch({ type: 'SET_HISTORY', payload: newHistory });
                      }}
                    />
                  ))}
                </div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
}