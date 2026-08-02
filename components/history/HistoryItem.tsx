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
      case 'GET': return 'text-green-600';
      case 'POST': return 'text-blue-600';
      case 'PUT': return 'text-orange-600';
      case 'DELETE': return 'text-red-600';
      case 'PATCH': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <button 
      onClick={onClick}
      className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors group flex flex-col gap-1.5 focus:outline-none focus:bg-gray-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${getMethodColor(request.method)}`}>
            {request.method}
          </span>
          <span className="text-xs font-mono text-gray-700 truncate max-w-[150px]" title={request.url}>
            {request.url || 'Empty URL'}
          </span>
        </div>
        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusColor}`}>
          {responseSummary.status}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {formattedTime}
        </span>
        <span>{responseSummary.timeMs} ms</span>
      </div>
    </button>
  );
}