import { Clock, HardDrive } from 'lucide-react';

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
    <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 font-mono">
      <div className="flex items-center gap-1.5">
        <Clock size={12} className="text-zinc-500" />
        <span>{timeMs} <span className="text-[10px] text-zinc-500">ms</span></span>
      </div>
      <div className="flex items-center gap-1.5">
        <HardDrive size={12} className="text-zinc-500" />
        <span>{formatSize(sizeBytes)}</span>
      </div>
    </div>
  );
}