'use client';

import { useHistory } from '../../hooks/useHistory';
import { useRequestDispatch } from '../../context/RequestContext';
import HistoryItem from './HistoryItem';
import { Clock, Folder, Settings, ChevronsLeft } from 'lucide-react';
import { useState } from 'react';
import { HistoryEntry } from '../../types';

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
    <div className="flex flex-col bg-background w-full h-full flex-shrink-0 z-10 border-none relative">
      {/* Tabs */}
      <div className="flex items-center px-4 pt-4 border-b border-border">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'history' ? 'border-[#8B5CF6] text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
        >
          <Clock size={16} className={activeTab === 'history' ? 'text-[#8B5CF6]' : 'text-secondary-text'} /> History
        </button>
        <div className="w-4" />
        <button 
          onClick={() => setActiveTab('collections')}
          className={`flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'collections' ? 'border-[#8B5CF6] text-primary-text' : 'border-transparent text-secondary-text hover:text-primary-text'}`}
        >
          <Folder size={16} className={activeTab === 'collections' ? 'text-[#8B5CF6]' : 'text-secondary-text'} /> Collections
        </button>
      </div>

      {/* Header Actions */}
      {activeTab === 'history' && (
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">RECENT REQUESTS</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4 mb-12">
        {activeTab === 'history' ? (
          history.length === 0 ? (
            <div className="p-6 text-center text-sm text-secondary-text flex flex-col items-center gap-3 mt-20">
              <Clock size={24} className="text-muted-text" />
              <p>No requests yet.<br/>Send a request to see it here.</p>
            </div>
          ) : (
            Object.entries(groupedHistory).map(([group, items]) => (
              items.length > 0 && (
                <div key={group} className="flex flex-col gap-1.5">
                  <h3 className="px-3 text-[10px] font-bold text-muted-text uppercase tracking-wider">{group}</h3>
                  <div className="flex flex-col gap-1">
                    {items.map((entry) => (
                      <HistoryItem 
                        key={entry.id} 
                        entry={entry} 
                        onClick={() => dispatch({ type: 'LOAD_FROM_HISTORY', payload: entry })}
                      />
                    ))}
                  </div>
                </div>
              )
            ))
          )
        ) : (
          <div className="p-6 text-center text-sm text-secondary-text flex flex-col items-center gap-3 mt-20">
            <Folder size={24} className="text-muted-text" />
            <p>Collections coming soon.</p>
          </div>
        )}
      </div>

      {/* Footer Settings */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-border bg-background flex items-center justify-between text-secondary-text">
        <button className="hover:text-primary-text transition-colors">
          <Settings size={18} />
        </button>
        <button className="hover:text-primary-text transition-colors">
          <ChevronsLeft size={18} />
        </button>
      </div>
    </div>
  );
}