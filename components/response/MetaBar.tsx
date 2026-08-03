import { Clock3, Database } from 'lucide-react';

interface MetaBarProps {
  timeMs: number;
  sizeBytes: number;
}

export default function MetaBar({ timeMs, sizeBytes }: MetaBarProps) {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="flex items-center gap-4 text-xs text-[#F4F1EA]/50 font-mono">
      <div className="flex items-center gap-1.5" title="Response Time">
        <Clock3 size={12} className="opacity-70 text-[#F4F1EA]" />
        <span className="text-[#F4F1EA]">{formatTime(timeMs)}</span>
      </div>
      <div className="flex items-center gap-1.5" title="Response Size">
        <Database size={12} className="opacity-70 text-[#F4F1EA]" />
        <span className="text-[#F4F1EA]">{formatSize(sizeBytes)}</span>
      </div>
    </div>
  );
}