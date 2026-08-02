import { getStatusColorClass } from '../../lib/http-utils';

interface StatusBadgeProps {
  status: number;
  statusText: string;
}

export default function StatusBadge({ status, statusText }: StatusBadgeProps) {
  const colorClass = getStatusColorClass(status);
  
  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-md border text-sm font-semibold ${colorClass}`}>
      <span className="mr-1.5">{status}</span>
      <span className="uppercase text-xs font-bold tracking-wider opacity-90">{statusText || 'Unknown'}</span>
    </div>
  );
}