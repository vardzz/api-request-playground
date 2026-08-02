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
    <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
      <div className="flex items-center gap-1.5">
        <Clock size={14} className="text-gray-400" />
        <span>{timeMs} <span className="text-xs text-gray-400">ms</span></span>
      </div>
      <div className="flex items-center gap-1.5">
        <HardDrive size={14} className="text-gray-400" />
        <span>{formatSize(sizeBytes)}</span>
      </div>
    </div>
  );
}