'use client';

import { useHistory } from '../../hooks/useHistory';
import { useRequestDispatch } from '../../context/RequestContext';
import HistoryItem from './HistoryItem';
import { Clock, Folder, Settings, ChevronsLeft } from 'lucide-react';
import { useState } from 'react';
import { HistoryEntry } from '../../types';

import { storage } from '../../lib/storage';

export default function HistorySidebar() {
  const { history } = useHistory();
  const dispatch = useRequestDispatch();
  const [activeTab, setActiveTab] = useState<'history' | 'collections'>('history');

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

    items.forEach(item => {
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
      {/* Tabs */}
      <div className="flex items-center px-4 pt-4 border-b border-zinc-800/60">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center justify-center gap-2 py-2 px-2 text-[13px] font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === 'history' ? 'border-purple-500 text-zinc-100' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
        >
          <Clock size={16} /> History
        </button>
        <div className="w-4" />
        <button 
          onClick={() => setActiveTab('collections')}
          className={`flex items-center justify-center gap-2 py-2 px-2 text-[13px] font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === 'collections' ? 'border-purple-500 text-zinc-100' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
        >
          <Folder size={16} /> Collections
        </button>
      </div>

      {/* Header Actions */}
      {activeTab === 'history' && (
        <div className="px-3 py-2 flex items-center justify-between mt-2">
          <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">RECENT REQUESTS</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4 mb-12">
        {activeTab === 'history' ? (
          history.length === 0 ? (
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
          )
        ) : (
          <div className="p-6 text-center text-sm text-zinc-400 font-medium flex flex-col items-center gap-3 mt-20">
            <div className="text-zinc-500 bg-zinc-900/50 p-3 rounded-full">
              <Folder size={24} />
            </div>
            <p>Collections coming soon.</p>
          </div>
        )}
      </div>

      {/* Footer Settings */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-zinc-800/60 bg-transparent flex items-center justify-between text-zinc-400">
        <button className="hover:text-zinc-200 transition-colors">
          <Settings size={18} />
        </button>
        <button className="hover:text-zinc-200 transition-colors">
          <ChevronsLeft size={18} />
        </button>
      </div>
    </div>
  );
}