export function calculatePayloadSize(data: unknown): number {
  if (data === undefined || data === null) {
    return 0;
  }
  
  let stringifiedData: string;
  if (typeof data === 'string') {
    stringifiedData = data;
  } else {
    try {
      stringifiedData = JSON.stringify(data);
    } catch {
      return 0; // fallback if data cannot be stringified (e.g. circular reference)
    }
  }

  // Calculate byte length for UTF-8 string
  return new Blob([stringifiedData]).size;
}

export function getStatusColorClass(status: number): string {
  if (status >= 200 && status < 300) {
    return 'bg-green-100 text-green-800 border-green-200';
  }
  if (status >= 400 && status < 500) {
    return 'bg-amber-100 text-amber-800 border-amber-200';
  }
  if (status >= 500) {
    return 'bg-red-100 text-red-800 border-red-200';
  }
  if (status >= 300 && status < 400) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
  return 'bg-gray-100 text-gray-800 border-gray-200';
}
