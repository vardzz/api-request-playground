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
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  }
  if (status >= 400 && status < 500) {
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  }
  if (status >= 500) {
    return 'bg-red-500/10 text-red-400 border border-red-500/20';
  }
  if (status >= 300 && status < 400) {
    return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
  }
  return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
}
