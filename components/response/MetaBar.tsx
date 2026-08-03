import { Clock3, Database } from 'lucide-react';

interface MetaBarProps {
  timeMs: number;
  sizeBytes: number;
}

export default function MetaBar({ timeMs, sizeBytes }: MetaBarProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
      <div className="flex items-center gap-1">
        <Clock3 size={12} />
        <span>{timeMs} ms</span>
      </div>
      <div className="flex items-center gap-1">
        <Database size={12} />
        <span>{formatSize(sizeBytes)}</span>
      </div>
    </div>
  );
}