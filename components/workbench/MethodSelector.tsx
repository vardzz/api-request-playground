'use client';

import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { HttpMethod } from '../../types';

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function MethodSelector() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_METHOD', payload: e.target.value as HttpMethod });
  };

  const getMethodColor = (method: HttpMethod) => {
    switch (method) {
      case 'GET': return 'text-emerald-400 bg-emerald-500/10';
      case 'POST': return 'text-blue-400 bg-blue-500/10';
      case 'PUT': return 'text-amber-400 bg-amber-500/10';
      case 'DELETE': return 'text-red-400 bg-red-500/10';
      case 'PATCH': return 'text-purple-400 bg-purple-500/10';
      default: return 'text-zinc-400 bg-zinc-500/10';
    }
  };

  return (
    <select
      value={state.request.method}
      onChange={handleMethodChange}
      className={`appearance-none font-bold text-xs rounded px-2.5 py-1 pr-6 focus:outline-none focus:ring-0 cursor-pointer transition-colors ${getMethodColor(state.request.method)}`}
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.25rem center',
        backgroundSize: '1em 1em',
      }}
    >
      {METHODS.map((method) => (
        <option key={method} value={method} className="bg-zinc-900 text-zinc-100 font-medium">
          {method}
        </option>
      ))}
    </select>
  );
}