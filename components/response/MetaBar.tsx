import { Clock3, HardDrive, ArrowDownUp } from 'lucide-react';

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
    <div className="flex items-center gap-4 text-xs font-medium text-muted-text font-mono">
      <div className="flex items-center gap-1.5">
        <Clock3 size={14} className="text-secondary-text opacity-70" />
        <span className="text-primary-text">{timeMs} <span className="text-[10px] text-muted-text uppercase tracking-wider">ms</span></span>
      </div>
      <div className="w-px h-3 bg-border" />
      <div className="flex items-center gap-1.5">
        <HardDrive size={14} className="text-secondary-text opacity-70" />
        <span className="text-primary-text">{formatSize(sizeBytes)}</span>
      </div>
      <div className="w-px h-3 bg-border" />
      <div className="flex items-center gap-1.5 hidden sm:flex">
        <ArrowDownUp size={14} className="text-secondary-text opacity-70" />
        <span className="text-primary-text">HTTP/2</span>
      </div>
    </div>
  );
}