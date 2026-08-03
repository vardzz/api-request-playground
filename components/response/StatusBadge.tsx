import { getStatusColorClass } from '../../lib/http-utils';

interface StatusBadgeProps {
  status: number;
  statusText: string;
}

export default function StatusBadge({ status, statusText }: StatusBadgeProps) {
  const getApexStatusColor = (status: number) => {
    return 'text-[#F4F1EA] bg-[#0F1115] border border-[#F4F1EA]/20';
  };

  const statusClass = getApexStatusColor(status);

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${statusClass} font-mono tracking-tight`}>
      <span className="text-xs font-bold">{status}</span>
      <span className="text-[10px] font-medium uppercase opacity-90">{statusText}</span>
    </div>
  );
}