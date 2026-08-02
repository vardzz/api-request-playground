import { getStatusColorClass } from '../../lib/http-utils';

interface StatusBadgeProps {
  status: number;
  statusText: string;
}

export default function StatusBadge({ status, statusText }: StatusBadgeProps) {
  const colorClass = getStatusColorClass(status);
  
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colorClass}`}>
      <span className="mr-1.5">{status}</span>
      <span className="uppercase text-[10px] font-bold tracking-wider opacity-90">{statusText || 'Unknown'}</span>
    </div>
  );
}