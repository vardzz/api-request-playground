import { useEffect } from 'react';
import { useRequestState, useRequestDispatch } from '../context/RequestContext';
import { storage } from '../lib/storage';
import { HistoryEntry, RequestConfig } from '../types';

const HISTORY_KEY = 'api_playground_history';

export function useHistory() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  // Load on mount (hydration safe)
  useEffect(() => {
    const saved = storage.get<HistoryEntry[]>(HISTORY_KEY, []);
    dispatch({ type: 'SET_HISTORY', payload: saved });
  }, [dispatch]);

  const addEntry = (request: RequestConfig, status: number, timeMs: number) => {
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      request,
      responseSummary: {
        status,
        timeMs
      }
    };
    
    const current = storage.get<HistoryEntry[]>(HISTORY_KEY, []);
    // Prepend and limit to 50 entries to avoid quota exhaustion
    const updated = [newEntry, ...current].slice(0, 50); 
    
    storage.set(HISTORY_KEY, updated);
    dispatch({ type: 'SET_HISTORY', payload: updated });
  };

  const clearHistory = () => {
    storage.remove(HISTORY_KEY);
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  return {
    history: state.history,
    addEntry,
    clearHistory
  };
}
