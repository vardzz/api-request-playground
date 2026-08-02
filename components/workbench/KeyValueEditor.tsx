'use client';

import { KeyValuePair } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onAdd: (item: KeyValuePair) => void;
  onUpdate: (item: KeyValuePair) => void;
  onRemove: (id: string) => void;
}

export default function KeyValueEditor({ items, onAdd, onUpdate, onRemove }: KeyValueEditorProps) {
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
      <div className="text-center py-8 bg-zinc-900/50 rounded-lg border border-dashed border-zinc-800">
        <p className="text-sm text-zinc-500 mb-3">No items added yet.</p>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-md transition-colors"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.enabled}
            onChange={(e) => onUpdate({ ...item, enabled: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-zinc-950"
            title="Enable/Disable"
          />
          
          <input
            type="text"
            value={item.key}
            onChange={(e) => onUpdate({ ...item, key: e.target.value })}
            placeholder="Key"
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
            spellCheck={false}
          />
          
          <input
            type="text"
            value={item.value}
            onChange={(e) => onUpdate({ ...item, value: e.target.value })}
            placeholder="Value"
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
            spellCheck={false}
          />
          
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      
      <div className="pt-2">
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-indigo-400 hover:bg-zinc-900 rounded transition-colors"
        >
          <Plus size={14} />
          Add Row
        </button>
      </div>
    </div>
  );
}