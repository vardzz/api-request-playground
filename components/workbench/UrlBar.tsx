'use client';

import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { Globe } from 'lucide-react';

export default function UrlBar() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  return (
    <div className="flex-1 flex relative items-center bg-transparent">
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-zinc-500">
        <Globe size={14} />
      </div>
      <input
        type="url"
        value={state.request.url}
        onChange={(e) => dispatch({ type: 'SET_URL', payload: e.target.value })}
        placeholder="https://api.example.com/v1/users"
        className="block w-full pl-8 pr-3 py-1.5 text-sm bg-transparent text-zinc-100 focus:outline-none font-mono placeholder-zinc-600"
      />
    </div>
  );
}