export interface KeyValuePair {
  id: string; // crypto.randomUUID() — NEVER use array index as id
  key: string;
  value: string;
  enabled: boolean; // lets user "disable" a row without deleting it (Postman-style)
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: string; // raw string; parse-on-send, not parse-on-keystroke
  bodyIsValidJson: boolean;
}

export interface ResponseData {
  status: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number;
  headers: Record<string, string>;
  data: unknown;
  error: string | null; // distinguishes network/CORS failure from a real HTTP response
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  request: RequestConfig;
  responseSummary: {
    // don't store the full response body in history — see Pitfall #6
    status: number;
    timeMs: number;
  };
}

export interface PlaygroundState {
  request: RequestConfig;
  response: ResponseData | null;
  isLoading: boolean;
  history: HistoryEntry[];
}
