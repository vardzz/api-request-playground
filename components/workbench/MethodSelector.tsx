'use client';

import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { ChevronDown } from 'lucide-react';
import { HttpMethod } from '../../types';

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function MethodSelector() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  // Apex specific color mapping
  const getMethodColor = (method: HttpMethod) => {
    switch (method) {
      case 'GET': return 'text-emerald-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-amber-400';
      case 'PATCH': return 'text-purple-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-zinc-300';
    }
  };

  return (
    <div className="relative group/method h-full flex items-center">
      <select
        value={state.request.method}
        onChange={(e) => dispatch({ type: 'SET_METHOD', payload: e.target.value as HttpMethod })}
        className={`h-full bg-transparent appearance-none border-none pl-3 pr-8 text-sm font-bold tracking-wider focus:outline-none focus:ring-0 cursor-pointer ${getMethodColor(state.request.method)}`}
      >
        {METHODS.map(method => (
          <option key={method} value={method} className="bg-[#0F1115] text-[#F4F1EA]">
            {method}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none text-[#F4F1EA]/50 group-hover/method:text-[#F4F1EA] transition-colors">
        <ChevronDown size={14} />
      </div>
    </div>
  );
}