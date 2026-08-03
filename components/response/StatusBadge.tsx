import { getStatusColorClass } from '../../lib/http-utils';

interface StatusBadgeProps {
  status: number;
  statusText: string;
}

export default function StatusBadge({ status, statusText }: StatusBadgeProps) {
  const getApexStatusColor = (s: number) => {
    if (s >= 200 && s < 300) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (s >= 300 && s < 400) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (s >= 400 && s < 500) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (s >= 500) return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-zinc-400 bg-zinc-800 border-zinc-700';
  };
  
  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getApexStatusColor(status)}`}>
      <span className="mr-1.5 font-mono">{status}</span>
      <span className="uppercase tracking-widest opacity-90">{statusText || 'Unknown'}</span>
    </div>
  );
}