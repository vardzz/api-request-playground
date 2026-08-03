'use client';

import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { Globe } from 'lucide-react';

export default function UrlBar() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  return (
    <div className="flex-1 flex relative items-center bg-transparent group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-text group-focus-within:text-accent transition-colors">
        <Globe size={16} />
      </div>
      <input
        type="url"
        value={state.request.url}
        onChange={(e) => dispatch({ type: 'SET_URL', payload: e.target.value })}
        placeholder="https://api.example.com/v1/users"
        className="block w-full pl-10 pr-4 py-2.5 text-sm bg-transparent text-primary-text focus:outline-none font-mono placeholder-muted-text transition-all"
      />
    </div>
  );
}