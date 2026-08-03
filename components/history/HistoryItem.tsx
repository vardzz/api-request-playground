import { HistoryEntry } from '../../types';
import { getStatusColorClass } from '../../lib/http-utils';
import { Clock3 } from 'lucide-react';

interface HistoryItemProps {
  entry: HistoryEntry;
  onClick: () => void;
  selected?: boolean;
}

export default function HistoryItem({ entry, onClick, selected }: HistoryItemProps) {
  const { request, responseSummary, timestamp } = entry;
  
  // Custom status color mapping for Apex
  const getApexStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-success bg-success/10';
    if (status >= 300 && status < 400) return 'text-[#3B82F6] bg-[#3B82F6]/10'; // Blue
    if (status >= 400 && status < 500) return 'text-warning bg-warning/10';
    if (status >= 500) return 'text-danger bg-danger/10';
    return 'text-muted-text bg-elevated';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-success';
      case 'POST': return 'text-[#3B82F6]'; // Blue
      case 'PUT': return 'text-warning';
      case 'DELETE': return 'text-danger';
      case 'PATCH': return 'text-[#8B5CF6]'; // Purple
      default: return 'text-muted-text';
    }
  };

  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const statusClass = getApexStatusColor(responseSummary.status);

  return (
    <div 
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        // Context menu logic placeholder
      }}
      className={`w-full text-left p-3 rounded-card transition-all cursor-pointer group flex flex-col gap-2 ${
        selected 
          ? 'bg-elevated border border-accent/50 shadow-sm' 
          : 'bg-transparent border border-transparent hover:bg-elevated/50 hover:border-border hover:shadow-subtle'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          <span className={`text-[11px] font-bold tracking-wider ${getMethodColor(request.method)}`}>
            {request.method}
          </span>
          <span className={`text-xs font-mono truncate ${selected ? 'text-primary-text' : 'text-secondary-text group-hover:text-primary-text transition-colors'}`} title={request.url}>
            {request.url || 'Empty URL'}
          </span>
        </div>
        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-pill ${statusClass} flex-shrink-0`}>
          {responseSummary.status}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-[10px] text-muted-text font-mono">
        <span className="flex items-center gap-1.5">
          <Clock3 size={12} className="opacity-70" />
          {formattedTime}
        </span>
        <span className="opacity-80">{responseSummary.timeMs} ms</span>
      </div>
    </div>
  );
}