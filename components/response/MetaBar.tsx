import { Clock3, HardDrive } from 'lucide-react';

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
    <div className="flex items-center gap-6 text-[13px] text-muted-text font-mono">
      <div className="flex items-center gap-2">
        <Clock3 size={14} className="opacity-70" />
        <span>{timeMs} <span className="opacity-70">ms</span></span>
      </div>
      <div className="flex items-center gap-2">
        <HardDrive size={14} className="opacity-70" />
        <span>{formatSize(sizeBytes)}</span>
      </div>
    </div>
  );
}