'use client';

import { useEffect, useState } from 'react';
import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function BodyEditor() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();
  const [localBody, setLocalBody] = useState(state.request.body);

  // Debounced validity check and sync to global state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let isValid = true;
      if (localBody.trim() !== '') {
        try {
          JSON.parse(localBody);
        } catch {
          isValid = false;
        }
      }
      
      dispatch({ 
        type: 'SET_BODY', 
        payload: { body: localBody, isValid } 
      });
    }, 400); // 400ms debounce

    return () => clearTimeout(timeoutId);
  }, [localBody, dispatch]);

  // Sync external state changes (e.g. LOAD_FROM_HISTORY) back to local state
  useEffect(() => {
    setLocalBody(state.request.body);
  }, [state.request.body]);

  const isValidJson = state.request.bodyIsValidJson;
  const isBodyEmpty = state.request.body.trim() === '';

  return (
    <div className="flex flex-col h-full border border-gray-300 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">JSON Body</span>
        <div className="flex items-center gap-1.5">
          {isBodyEmpty ? (
            <span className="text-xs text-gray-400">Empty</span>
          ) : isValidJson ? (
            <>
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">Valid JSON</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} className="text-red-500" />
              <span className="text-xs text-red-600 font-medium">Invalid JSON</span>
            </>
          )}
        </div>
      </div>
      <textarea
        value={localBody}
        onChange={(e) => setLocalBody(e.target.value)}
        className={`flex-1 p-4 w-full h-48 sm:h-64 resize-y font-mono text-sm focus:outline-none focus:ring-0 ${
          !isValidJson && !isBodyEmpty ? 'bg-red-50/30' : 'bg-white'
        }`}
        placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"
        spellCheck={false}
      />
    </div>
  );
}