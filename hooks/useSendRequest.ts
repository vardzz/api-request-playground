import { useRequestState, useRequestDispatch } from '../context/RequestContext';
import { calculatePayloadSize } from '../lib/http-utils';

export function useSendRequest() {
  const state = useRequestState();
  const dispatch = useRequestDispatch();

  const sendRequest = async () => {
    const { method, url, params, headers, body } = state.request;
    
    if (!url || url.trim() === '') {
      dispatch({ type: 'REQUEST_ERROR', payload: 'URL cannot be empty' });
      return;
    }

    // Process URL with params securely using URLSearchParams
    let finalUrl = url.trim();
    try {
      // Add a protocol if missing so URL parsing works
      const urlWithProtocol = finalUrl.includes('://') ? finalUrl : `https://${finalUrl}`;
      const urlObj = new URL(urlWithProtocol);
      const searchParams = new URLSearchParams(urlObj.search);
      
      params
        .filter(p => p.enabled && p.key.trim() !== '')
        .forEach(p => {
          searchParams.append(p.key.trim(), p.value);
        });
      
      urlObj.search = searchParams.toString();
      finalUrl = urlObj.toString();
    } catch (e) {
      dispatch({ type: 'REQUEST_ERROR', payload: 'Invalid URL format' });
      return;
    }

    // Process headers
    const fetchHeaders: HeadersInit = {};
    headers
      .filter(h => h.enabled && h.key.trim() !== '')
      .forEach(h => {
        fetchHeaders[h.key.trim()] = h.value;
      });

    dispatch({ type: 'REQUEST_START' });

    const startTime = performance.now();
    
    try {
      const fetchOptions: RequestInit = {
        method,
        headers: fetchHeaders,
      };

      // Conditionally omit body for GET
      if (method !== 'GET' && body.trim() !== '') {
        fetchOptions.body = body;
      }

      const response = await fetch(finalUrl, fetchOptions);
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Try to parse JSON, fallback to text
      const responseText = await response.text();
      const sizeBytes = calculatePayloadSize(responseText);
      
      let data: unknown;
      if (responseText.trim() === '') {
        data = null;
      } else {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = responseText;
        }
      }

      dispatch({
        type: 'REQUEST_SUCCESS',
        payload: {
          status: response.status,
          statusText: response.statusText,
          timeMs,
          sizeBytes,
          headers: responseHeaders,
          data,
          error: null,
        }
      });
    } catch (error) {
      // Differentiate network/CORS error vs valid HTTP error
      let errorMessage = 'An unknown error occurred';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Request blocked — likely CORS. This API doesn\'t allow browser-based requests from this origin, or you are offline.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch({ type: 'REQUEST_ERROR', payload: errorMessage });
    }
  };

  return { sendRequest };
}
