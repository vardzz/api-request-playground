'use client';

import { useHistory } from '../../hooks/useHistory';
import { useRequestDispatch } from '../../context/RequestContext';
import HistoryItem from './HistoryItem';
import { Clock3, Trash2, FolderKanban } from 'lucide-react';
import { useState } from 'react';
import { HistoryEntry } from '../../types';

export default function HistorySidebar() {
  const { history, clearHistory } = useHistory();
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
    <div className="flex flex-col bg-surface w-full h-full flex-shrink-0 z-10 border-r border-border">
      {/* Tabs */}
      <div className="flex items-center p-2 gap-1 border-b border-border bg-surface/50 backdrop-blur-sm">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-input transition-colors ${activeTab === 'history' ? 'bg-elevated text-primary-text shadow-sm' : 'text-muted-text hover:text-secondary-text hover:bg-elevated/50'}`}
        >
          <Clock3 size={14} /> History
        </button>
        <button 
          onClick={() => setActiveTab('collections')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-input transition-colors ${activeTab === 'collections' ? 'bg-elevated text-primary-text shadow-sm' : 'text-muted-text hover:text-secondary-text hover:bg-elevated/50'}`}
        >
          <FolderKanban size={14} /> Collections
        </button>
      </div>

      {/* Header Actions */}
      {activeTab === 'history' && (
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Recent Requests</span>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-1.5 text-muted-text hover:text-danger hover:bg-danger/10 rounded-button transition-colors click-scale"
              title="Clear history"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4">
        {activeTab === 'history' ? (
          history.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-text flex flex-col items-center gap-3 mt-10">
              <div className="w-12 h-12 rounded-full bg-elevated flex items-center justify-center">
                <Clock3 size={20} className="opacity-50" />
              </div>
              <p>No requests yet.<br/>Send a request to see it here.</p>
            </div>
          ) : (
            Object.entries(groupedHistory).map(([group, items]) => (
              items.length > 0 && (
                <div key={group} className="flex flex-col gap-1.5">
                  <h3 className="px-2 text-[10px] font-bold text-muted-text uppercase tracking-wider">{group}</h3>
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
          <div className="p-6 text-center text-sm text-muted-text flex flex-col items-center gap-3 mt-10">
            <div className="w-12 h-12 rounded-full bg-elevated flex items-center justify-center">
              <FolderKanban size={20} className="opacity-50" />
            </div>
            <p>Collections coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}