import { PlaygroundState, KeyValuePair, HttpMethod, ResponseData, HistoryEntry } from '../types';

export type RequestAction =
  | { type: 'SET_METHOD'; payload: HttpMethod }
  | { type: 'SET_URL'; payload: string }
  | { type: 'ADD_PARAM'; payload: KeyValuePair }
  | { type: 'UPDATE_PARAM'; payload: KeyValuePair }
  | { type: 'REMOVE_PARAM'; payload: string }
  | { type: 'ADD_HEADER'; payload: KeyValuePair }
  | { type: 'UPDATE_HEADER'; payload: KeyValuePair }
  | { type: 'REMOVE_HEADER'; payload: string }
  | { type: 'SET_BODY'; payload: { body: string; isValid: boolean } }
  | { type: 'REQUEST_START' }
  | { type: 'REQUEST_SUCCESS'; payload: ResponseData }
  | { type: 'REQUEST_ERROR'; payload: string }
  | { type: 'LOAD_FROM_HISTORY'; payload: HistoryEntry }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_HISTORY'; payload: HistoryEntry[] };

export const initialState: PlaygroundState = {
  request: {
    method: 'GET',
    url: '',
    params: [],
    headers: [],
    body: '',
    bodyIsValidJson: true,
  },
  response: null,
  isLoading: false,
  history: [],
};

export const requestReducer = (state: PlaygroundState, action: RequestAction): PlaygroundState => {
  switch (action.type) {
    case 'SET_METHOD':
      return { ...state, request: { ...state.request, method: action.payload } };
    case 'SET_URL':
      return { ...state, request: { ...state.request, url: action.payload } };
    case 'ADD_PARAM':
      return { ...state, request: { ...state.request, params: [...state.request.params, action.payload] } };
    case 'UPDATE_PARAM':
      return {
        ...state,
        request: {
          ...state.request,
          params: state.request.params.map((p) => (p.id === action.payload.id ? action.payload : p)),
        },
      };
    case 'REMOVE_PARAM':
      return {
        ...state,
        request: {
          ...state.request,
          params: state.request.params.filter((p) => p.id !== action.payload),
        },
      };
    case 'ADD_HEADER':
      return { ...state, request: { ...state.request, headers: [...state.request.headers, action.payload] } };
    case 'UPDATE_HEADER':
      return {
        ...state,
        request: {
          ...state.request,
          headers: state.request.headers.map((h) => (h.id === action.payload.id ? action.payload : h)),
        },
      };
    case 'REMOVE_HEADER':
      return {
        ...state,
        request: {
          ...state.request,
          headers: state.request.headers.filter((h) => h.id !== action.payload),
        },
      };
    case 'SET_BODY':
      return {
        ...state,
        request: {
          ...state.request,
          body: action.payload.body,
          bodyIsValidJson: action.payload.isValid,
        },
      };
    case 'REQUEST_START':
      return { ...state, isLoading: true, response: null };
    case 'REQUEST_SUCCESS':
      return { ...state, isLoading: false, response: action.payload };
    case 'REQUEST_ERROR':
      return {
        ...state,
        isLoading: false,
        response: {
          status: 0,
          statusText: 'Error',
          timeMs: 0,
          sizeBytes: 0,
          headers: {},
          data: null,
          error: action.payload,
        },
      };
    case 'LOAD_FROM_HISTORY':
      return { ...state, request: action.payload.request, response: null };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    default:
      return state;
  }
};
