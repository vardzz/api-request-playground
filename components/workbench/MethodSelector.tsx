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
      case 'GET': return 'text-success';
      case 'POST': return 'text-accent';
      case 'PUT': return 'text-warning';
      case 'DELETE': return 'text-danger';
      case 'PATCH': return 'text-warning';
      default: return 'text-primary-text';
    }
  };

  return (
    <div className="relative group/method h-full">
      <select
        value={state.request.method}
        onChange={(e) => dispatch({ type: 'SET_METHOD', payload: e.target.value as HttpMethod })}
        className={`appearance-none bg-transparent ${getMethodColor(state.request.method)} font-bold text-sm h-full pl-4 pr-8 py-2 focus:outline-none cursor-pointer tracking-wide`}
      >
        {METHODS.map((method) => (
          <option key={method} value={method} className="bg-elevated text-primary-text">
            {method}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-muted-text group-hover/method:text-secondary-text transition-colors">x
        <ChevronDown size={14} />
      </div>
    </div>
  );
}