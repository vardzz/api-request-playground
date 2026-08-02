import { HistoryEntry } from '../../types';
import { getStatusColorClass } from '../../lib/http-utils';
import { Clock } from 'lucide-react';

interface HistoryItemProps {
  entry: HistoryEntry;
  onClick: () => void;
}

export default function HistoryItem({ entry, onClick }: HistoryItemProps) {
  const { request, responseSummary, timestamp } = entry;
  const statusColor = getStatusColorClass(responseSummary.status);
  
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-amber-400';
      case 'DELETE': return 'text-red-400';
      case 'PATCH': return 'text-purple-400';
      default: return 'text-zinc-400';
    }
  };

  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <button 
      onClick={onClick}
      className="w-full text-left p-2.5 rounded hover:bg-zinc-800/50 transition-colors group flex flex-col gap-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          <span className={`text-[10px] font-bold ${getMethodColor(request.method)}`}>
            {request.method}
          </span>
          <span className="text-xs font-mono text-zinc-300 truncate" title={request.url}>
            {request.url || 'Empty URL'}
          </span>
        </div>
        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusColor} flex-shrink-0`}>
          {responseSummary.status}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {formattedTime}
        </span>
        <span>{responseSummary.timeMs} ms</span>
      </div>
    </button>
  );
}