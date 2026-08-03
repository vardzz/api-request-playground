'use client';

import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { ChevronDown } from 'lucide-react';
import { HttpMethod } from '../../types';

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

export default function MethodSelector() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  // Apex specific color mapping
  const getMethodColor = (method: HttpMethod) => {
    switch (method) {
      case 'GET': return 'text-emerald-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-amber-400';
      case 'DELETE': return 'text-red-400';
      case 'PATCH': return 'text-amber-400';
      default: return 'text-zinc-300';
    }
  };

  return (
    <div className="relative group/method h-full flex items-center">
      <select
        value={state.request.method}
        onChange={(e) => dispatch({ type: 'SET_METHOD', payload: e.target.value as HttpMethod })}
        className={`appearance-none bg-transparent ${getMethodColor(state.request.method)} font-bold text-sm h-full pl-3 pr-7 py-1.5 focus:outline-none cursor-pointer tracking-wide`}
      >
        {METHODS.map((method) => (
          <option key={method} value={method} className="bg-zinc-900 text-zinc-200">
            {method}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none text-zinc-500 group-hover/method:text-zinc-400 transition-colors">
        <ChevronDown size={14} />
      </div>
    </div>
  );
}