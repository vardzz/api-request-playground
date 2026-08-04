'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';
import { useRequestDispatch } from '../../context/RequestContext';

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { history } = useHistory();
  const dispatch = useRequestDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredHistory = history.filter(item => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase().trim();
    
    const urlMatch = item.request.url.toLowerCase().includes(query);
    const methodMatch = item.request.method.toLowerCase().includes(query);
    const statusMatch = item.responseSummary?.status?.toString().includes(query) || false;
    
    const paramsMatch = item.request.params.some(p => p.enabled && (p.key.toLowerCase().includes(query) || p.value.toLowerCase().includes(query)));
    const headersMatch = item.request.headers.some(h => h.enabled && (h.key.toLowerCase().includes(query) || h.value.toLowerCase().includes(query)));
    
    return urlMatch || methodMatch || statusMatch || paramsMatch || headersMatch;
  });

  return (
    <div className="w-full max-w-[500px] px-4" ref={dropdownRef}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4F1EA]/50" size={16} />
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Search requests..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full bg-[#0F1115] border border-[#F4F1EA]/20 rounded-lg py-1.5 pl-9 pr-14 text-sm text-[#F4F1EA] placeholder:text-[#F4F1EA]/50 focus:outline-none focus:border-[#F4F1EA] transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <span className="text-xs font-mono text-[#F4F1EA] bg-[#0F1115] border border-[#F4F1EA]/20 rounded px-1.5 py-0.5 pointer-events-none">Ctrl K</span>
        </div>

        {/* Dropdown */}
        {isFocused && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1D24] border border-[#F4F1EA]/20 rounded-lg shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#F4F1EA]/10 scrollbar-track-transparent">
            {filteredHistory.length === 0 ? (
              <div className="p-4 text-center text-sm text-[#F4F1EA]/50">
                No matching requests found
              </div>
            ) : (
              <ul className="flex flex-col">
                {filteredHistory.map(entry => (
                  <li 
                    key={entry.id} 
                    className="flex flex-col p-3 border-b border-[#F4F1EA]/10 last:border-0 hover:bg-[#F4F1EA]/5 cursor-pointer transition-colors"
                    onClick={() => {
                      dispatch({ type: 'LOAD_FROM_HISTORY', payload: entry });
                      setIsFocused(false);
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        entry.request.method === 'GET' ? 'text-blue-400 bg-blue-400/10' :
                        entry.request.method === 'POST' ? 'text-green-400 bg-green-400/10' :
                        entry.request.method === 'PUT' ? 'text-yellow-400 bg-yellow-400/10' :
                        entry.request.method === 'DELETE' ? 'text-red-400 bg-red-400/10' :
                        'text-purple-400 bg-purple-400/10'
                      }`}>
                        {entry.request.method}
                      </span>
                      <span className="text-xs text-[#F4F1EA] truncate font-mono">{entry.request.url}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#F4F1EA]/50">
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      {entry.responseSummary && (
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            entry.responseSummary.status >= 200 && entry.responseSummary.status < 300 ? 'bg-green-500' : 
                            entry.responseSummary.status >= 400 ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          {entry.responseSummary.status} {entry.responseSummary.statusText}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
