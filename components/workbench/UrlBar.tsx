'use client';

import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { Globe } from 'lucide-react';

export default function UrlBar() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  return (
    <div className="flex-1 flex items-center h-full relative group/url">
      <div className="pl-3 pr-2 text-muted-text group-focus-within/url:text-primary-text transition-colors">
        <Globe size={16} />
      </div>
      <input
        type="text"
        value={state.request.url}
        onChange={(e) => dispatch({ type: 'SET_URL', payload: e.target.value })}
        placeholder="https://api.example.com/v1/users"
        className="flex-1 h-full bg-transparent border-none text-primary-text text-[13px] placeholder-muted-text focus:outline-none focus:ring-0 font-mono tracking-tight"
        spellCheck={false}
      />
    </div>
  );
}