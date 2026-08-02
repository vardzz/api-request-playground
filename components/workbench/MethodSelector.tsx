'use client';

import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { HttpMethod } from '../../types';
import { ChevronDown } from 'lucide-react';

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function MethodSelector() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_METHOD', payload: e.target.value as HttpMethod });
  };

  const getMethodColor = (method: HttpMethod) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-50';
      case 'POST': return 'text-blue-600 bg-blue-50';
      case 'PUT': return 'text-orange-600 bg-orange-50';
      case 'DELETE': return 'text-red-600 bg-red-50';
      case 'PATCH': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="relative">
      <select
        value={state.request.method}
        onChange={handleMethodChange}
        className={`appearance-none font-semibold text-sm rounded-l-md px-4 py-2.5 pr-8 border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors ${getMethodColor(state.request.method)}`}
      >
        {METHODS.map((method) => (
          <option key={method} value={method} className="bg-white text-gray-900 font-medium">
            {method}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <ChevronDown size={16} />
      </div>
    </div>
  );
}