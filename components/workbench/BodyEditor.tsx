'use client';

import { useEffect, useState, useRef } from 'react';
import { useRequestState, useRequestDispatch } from '../../context/RequestContext';
import { CheckCircle2, AlertCircle, Braces } from 'lucide-react';

export default function BodyEditor() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();
  const [localBody, setLocalBody] = useState(state.request.body);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Basic line numbers calculation
  const lineCount = localBody.split('\n').length;
  const lines = Array.from({ length: Math.max(10, lineCount) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-background relative group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface/50">
        <div className="flex items-center gap-2">
          <Braces size={14} className="text-accent" />
          <span className="text-[11px] font-bold text-primary-text uppercase tracking-widest">JSON</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isBodyEmpty ? (
            <span className="text-xs text-muted-text">Empty</span>
          ) : isValidJson ? (
            <div className="flex items-center gap-1.5 bg-success/10 px-2 py-0.5 rounded-pill">
              <CheckCircle2 size={12} className="text-success" />
              <span className="text-[10px] text-success font-semibold tracking-wide uppercase">Valid</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-danger/10 px-2 py-0.5 rounded-pill">
              <AlertCircle size={12} className="text-danger" />
              <span className="text-[10px] text-danger font-semibold tracking-wide uppercase">Invalid</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Pseudo Gutter for Line Numbers */}
        <div className="w-12 bg-surface/30 border-r border-border flex flex-col items-end py-4 select-none overflow-hidden text-[13px] font-mono leading-relaxed text-muted-text/50">
          {lines.map(line => (
            <div key={line} className="pr-3 h-[21px]">{line}</div>
          ))}
        </div>
        
        <textarea
          ref={textareaRef}
          value={localBody}
          onChange={(e) => setLocalBody(e.target.value)}
          className={`flex-1 p-4 w-full h-full resize-none font-mono text-[13px] leading-relaxed focus:outline-none focus:ring-0 ${
            !isValidJson && !isBodyEmpty ? 'bg-danger/5 text-primary-text selection:bg-danger/20' : 'bg-transparent text-primary-text selection:bg-accent/30'
          }`}
          placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"
          spellCheck={false}
          style={{ whiteSpace: 'pre', lineHeight: '21px' }}
        />
      </div>
    </div>
  );
}