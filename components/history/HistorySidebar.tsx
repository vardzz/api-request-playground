'use client';

import { useHistory } from '../../hooks/useHistory';
import { useRequestDispatch } from '../../context/RequestContext';
import HistoryItem from './HistoryItem';
import { Clock, PanelLeftClose } from 'lucide-react';
import { HistoryEntry } from '../../types';
import { storage } from '../../lib/storage';

interface HistorySidebarProps {
  onClose?: () => void;
}

export default function HistorySidebar({ onClose }: HistorySidebarProps) {
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 border-b border-[#F4F1EA]/20">
        <div className="flex items-center justify-center gap-2 py-2 px-2 text-[13px] font-medium border-b-2 -mb-[1px] border-[#F4F1EA] text-[#F4F1EA]">
          <Clock size={16} /> History
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[#F4F1EA]/10 rounded-md transition-colors text-[#F4F1EA]/70 hover:text-[#F4F1EA] mb-1"
            title="Close Sidebar"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      <div className="px-3 py-2 flex items-center justify-between mt-2">
        <span className="text-[10px] font-semibold tracking-wider text-[#F4F1EA]/50 uppercase">RECENT REQUESTS</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#F4F1EA]/10 scrollbar-track-transparent">
        {history.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#F4F1EA]/50 font-medium flex flex-col items-center gap-3 mt-20">
            <div className="text-[#F4F1EA]/30 bg-[#F4F1EA]/5 p-3 rounded-full">
              <Clock size={24} strokeWidth={1.5} />
            </div>
            <p>No request history yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-4">
            {Object.entries(groupedHistory).map(([group, items]) => {
              if (items.length === 0) return null;
              
              return (
                <div key={group} className="flex flex-col gap-3">
                  <h3 className="px-1 text-[10px] font-bold text-[#F4F1EA]/50 uppercase tracking-wider">{group}</h3>
                  <div className="flex flex-col gap-2">
                    {items.map(entry => (
                      <HistoryItem 
                        key={entry.id} 
                        entry={entry} 
                        onClick={() => dispatch({ type: 'LOAD_FROM_HISTORY', payload: entry })}
                        onDelete={() => {
                          const newHistory = history.filter(h => h.id !== entry.id);
                          dispatch({ type: 'SET_HISTORY', payload: newHistory });
                          storage.set('api_playground_history', newHistory);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}