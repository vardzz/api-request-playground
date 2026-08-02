'use client';

import { RequestProvider, useRequestState, useRequestDispatch } from '../context/RequestContext';
import { useEffect } from 'react';

function DummyComponent() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  useEffect(() => {
    // Expose dispatch and state to window for easy console testing
    (window as any).dispatch = dispatch;
    (window as any).getState = () => state;
    console.log('Current State:', state);
  }, [state, dispatch]);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">API Request Playground</h1>
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => dispatch({ type: 'SET_METHOD', payload: 'POST' })}
        >
          Test SET_METHOD POST
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() =>
            dispatch({
              type: 'ADD_PARAM',
              payload: { id: crypto.randomUUID(), key: 'foo', value: 'bar', enabled: true },
            })
          }
        >
          Test ADD_PARAM
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={() => dispatch({ type: 'REQUEST_START' })}
        >
          Test REQUEST_START
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <RequestProvider>
      <main className="min-h-screen bg-white">
        <DummyComponent />
      </main>
    </RequestProvider>
  );
}
