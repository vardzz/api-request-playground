'use client';

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { requestReducer, initialState, RequestAction } from '../reducers/requestReducer';
import { PlaygroundState } from '../types';

const RequestStateContext = createContext<PlaygroundState | null>(null);
const RequestDispatchContext = createContext<Dispatch<RequestAction> | null>(null);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(requestReducer, initialState);

  return (
    <RequestStateContext.Provider value={state}>
      <RequestDispatchContext.Provider value={dispatch}>
        {children}
      </RequestDispatchContext.Provider>
    </RequestStateContext.Provider>
  );
};

export const useRequestState = () => {
  const context = useContext(RequestStateContext);
  if (!context) {
    throw new Error('useRequestState must be used within a RequestProvider');
  }
  return context;
};

export const useRequestDispatch = () => {
  const context = useContext(RequestDispatchContext);
  if (!context) {
    throw new Error('useRequestDispatch must be used within a RequestProvider');
  }
  return context;
};
