'use client';

import { KeyValuePair } from '../../types';
import { Plus, Trash2, GripVertical, Check } from 'lucide-react';

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onAdd: (item: KeyValuePair) => void;
  onUpdate: (item: KeyValuePair) => void;
  onRemove: (id: string) => void;
  placeholderKey?: string;
  placeholderValue?: string;
}

export default function KeyValueEditor({ 
  items, 
  onAdd, 
  onUpdate, 
  onRemove,
  placeholderKey = "Key",
  placeholderValue = "Value"
}: KeyValueEditorProps) {
  const handleAdd = () => {
    onAdd({
      id: crypto.randomUUID(),
      key: '',
      value: '',
      enabled: true,
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-10 flex flex-col items-center justify-center">
        <p className="text-sm text-zinc-500 mb-4">No parameters configured.</p>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Parameter
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 group relative">
          
          <button
            onClick={() => onUpdate({ ...item, enabled: !item.enabled })}
            className={`w-5 h-5 flex-shrink-0 rounded-[4px] border flex items-center justify-center transition-colors ${
              item.enabled 
                ? 'bg-purple-600 border-purple-600 text-white' 
                : 'bg-zinc-900/90 border-zinc-700 text-transparent'
            }`}
          >
            <Check size={14} strokeWidth={3} />
          </button>
          
          <input
            type="text"
            value={item.key}
            onChange={(e) => onUpdate({ ...item, key: e.target.value })}
            placeholder={placeholderKey}
            className="flex-1 bg-zinc-900/90 border border-zinc-800/80 text-zinc-200 text-sm rounded-lg px-3 py-2 focus:border-purple-500/50 placeholder:text-zinc-600 focus:outline-none transition-colors font-mono"
            spellCheck={false}
          />
          
          <input
            type="text"
            value={item.value}
            onChange={(e) => onUpdate({ ...item, value: e.target.value })}
            placeholder={placeholderValue}
            className="flex-1 bg-zinc-900/90 border border-zinc-800/80 text-zinc-200 text-sm rounded-lg px-3 py-2 focus:border-purple-500/50 placeholder:text-zinc-600 focus:outline-none transition-colors font-mono"
            spellCheck={false}
          />
          
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity absolute right-[-40px]">
            <button
              onClick={() => onRemove(item.id)}
              className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
              title="Remove item"
            >
              <Trash2 size={16} />
            </button>
            <div className="text-zinc-600 cursor-grab p-1.5 hover:text-zinc-400">
              <GripVertical size={16} />
            </div>
          </div>
        </div>
      ))}
      
      <div className="pt-2 flex pl-8">
        <button
          onClick={handleAdd}
          className="text-zinc-400 hover:text-zinc-200 text-sm flex items-center gap-1.5 mt-3 transition-colors"
        >
          <Plus size={14} />
          {placeholderKey === 'New header' ? 'Add Header' : 'Add Param'}
        </button>
      </div>
    </div>
  );
}