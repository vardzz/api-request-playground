import { HistoryEntry } from '../../types';
import { getStatusColorClass } from '../../lib/http-utils';
import { Clock3, Trash2 } from 'lucide-react';

interface HistoryItemProps {
  entry: HistoryEntry;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  selected?: boolean;
}

export default function HistoryItem({ entry, onClick, onDelete, selected }: HistoryItemProps) {
  const { request, responseSummary, timestamp } = entry;
  
  const getApexStatusColor = (status: number) => {
    return 'text-[#F4F1EA] bg-[#0F1115] border border-[#F4F1EA]/20';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-amber-400';
      case 'PATCH': return 'text-purple-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-[#F4F1EA]';
    }
  };

  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const statusClass = getApexStatusColor(responseSummary.status);

  return (
    <div 
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer group flex flex-col gap-2 relative ${
        selected 
          ? 'bg-[#0F1115] border border-[#F4F1EA] shadow-sm' 
          : 'bg-[#0F1115] border border-transparent hover:border-[#F4F1EA]/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          <span className={`text-[11px] font-bold tracking-wider ${getMethodColor(request.method)}`}>
            {request.method}
          </span>
          <span className={`text-xs font-mono truncate ${selected ? 'text-[#F4F1EA]' : 'text-[#F4F1EA]/50 group-hover:text-[#F4F1EA] transition-colors'}`} title={request.url}>
            {request.url || 'Empty URL'}
          </span>
        </div>
        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${statusClass} flex-shrink-0`}>
          {responseSummary.status}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-[10px] text-muted-text font-mono relative">
        <span className="flex items-center gap-1.5">
          <Clock3 size={12} className="opacity-70" />
          {formattedTime}
        </span>
        <span className="opacity-80 group-hover:opacity-0 transition-opacity">{responseSummary.timeMs} ms</span>
        
        {/* Delete Button (visible on hover) */}
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="absolute right-0 opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-all z-10 bg-[#13131a] rounded"
            title="Delete from history"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}