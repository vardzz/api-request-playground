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
    <div className="flex flex-col h-[300px] border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">JSON Body</span>
        <div className="flex items-center gap-1.5">
          {isBodyEmpty ? (
            <span className="text-xs text-zinc-500">Empty</span>
          ) : isValidJson ? (
            <>
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-xs text-emerald-500 font-medium">Valid JSON</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} className="text-red-500" />
              <span className="text-xs text-red-400 font-medium">Invalid JSON</span>
            </>
          )}
        </div>
      </div>
      <textarea
        value={localBody}
        onChange={(e) => setLocalBody(e.target.value)}
        className={`flex-1 p-3 w-full resize-none font-mono text-sm focus:outline-none focus:ring-0 ${
          !isValidJson && !isBodyEmpty ? 'bg-red-950/10 text-zinc-300' : 'bg-transparent text-zinc-300'
        }`}
        placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"
        spellCheck={false}
      />
    </div>
  );
}