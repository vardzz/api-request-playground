'use client';

import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { Globe } from 'lucide-react';

export default function UrlBar() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  return (
    <div className="flex-1 flex relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Globe size={16} />
      </div>
      <input
        type="text"
        value={state.request.url}
        onChange={(e) => dispatch({ type: 'SET_URL', payload: e.target.value })}
        placeholder="https://api.example.com/v1/users"
        className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono placeholder-gray-400"
      />
    </div>
  );
}