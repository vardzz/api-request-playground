import { getStatusColorClass } from '../../lib/http-utils';

interface StatusBadgeProps {
  status: number;
  statusText: string;
}

export default function StatusBadge({ status, statusText }: StatusBadgeProps) {
  const getApexStatusColor = (s: number) => {
    if (s >= 200 && s < 300) return 'text-[#22c55e] bg-[#22c55e]/10 border-transparent';
    if (s >= 300 && s < 400) return 'text-[#3B82F6] bg-[#3B82F6]/10 border-transparent';
    if (s >= 400 && s < 500) return 'text-warning bg-warning/10 border-transparent';
    if (s >= 500) return 'text-danger bg-danger/10 border-transparent';
    return 'text-muted-text bg-elevated border-border';
  };
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-[4px] text-[11px] font-semibold border ${getApexStatusColor(status)}`}>
      <span className="mr-1.5 font-mono">{status}</span>
      <span className="uppercase tracking-widest opacity-90">{statusText || 'Unknown'}</span>
    </div>
  );
}