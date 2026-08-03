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
      case 'GET': return 'text-success hover:bg-success/10';
      case 'POST': return 'text-[#3B82F6] hover:bg-[#3B82F6]/10'; // Blue
      case 'PUT': return 'text-warning hover:bg-warning/10';
      case 'DELETE': return 'text-danger hover:bg-danger/10';
      case 'PATCH': return 'text-[#8B5CF6] hover:bg-[#8B5CF6]/10'; // Purple
      default: return 'text-muted-text hover:bg-elevated';
    }
  };

  return (
    <select
      value={state.request.method}
      onChange={handleMethodChange}
      className={`appearance-none font-bold text-xs rounded-input px-3 py-2 pr-7 focus:outline-none focus:ring-0 cursor-pointer transition-colors bg-transparent ${getMethodColor(state.request.method)}`}
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.5rem center',
        backgroundSize: '1em 1em',
      }}
    >
      {METHODS.map((method) => (
        <option key={method} value={method} className="bg-surface text-primary-text font-medium">
          {method}
        </option>
      ))}
    </select>
  );
}