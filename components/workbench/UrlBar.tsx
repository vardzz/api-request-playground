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
    <div className="flex-1 flex items-center h-full relative group/url">
      <div className="pl-3 pr-2 text-[#F4F1EA]/50 group-focus-within/url:text-[#F4F1EA] transition-colors">
        <Globe size={16} />
      </div>
      <input
        type="text"
        value={state.request.url}
        onChange={(e) => dispatch({ type: 'SET_URL', payload: e.target.value })}
        onKeyDown={handleKeyDown}
        placeholder="https://api.example.com/v1/users"
        className="flex-1 h-full bg-transparent border-none text-[#F4F1EA] text-sm placeholder-[#F4F1EA]/30 focus:outline-none focus:ring-0 font-mono tracking-tight"
        spellCheck={false}
      />
    </div>
  );
}