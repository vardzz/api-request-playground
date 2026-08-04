'use client';

import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { Globe } from 'lucide-react';
import { useSendRequest } from '../../hooks/useSendRequest';

export default function UrlBar() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();
  const { sendRequest } = useSendRequest();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendRequest();
    }
  };

  return (
    <div className="flex-1 flex items-center h-full relative group/url min-w-0">
      <div className="pl-3 pr-2 text-[#F4F1EA]/50 group-focus-within/url:text-[#F4F1EA] transition-colors flex-shrink-0">
        <Globe size={16} />
      </div>
      
      <div className="flex-1 h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[#F4F1EA]/10 scrollbar-track-transparent flex items-center">
        <div className="min-w-full relative h-full flex items-center">
          {/* Invisible span forces the container width to match the text length so it can scroll */}
          <span className="invisible whitespace-nowrap font-mono text-sm tracking-tight pr-4" aria-hidden="true">
            {state.request.url || 'https://api.example.com/v1/users'}
          </span>
          <input
            type="text"
            value={state.request.url}
            onChange={(e) => dispatch({ type: 'SET_URL', payload: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="https://api.example.com/v1/users"
            className="absolute inset-0 w-full h-full bg-transparent border-none text-[#F4F1EA] text-sm placeholder-[#F4F1EA]/30 focus:outline-none focus:ring-0 font-mono tracking-tight"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}