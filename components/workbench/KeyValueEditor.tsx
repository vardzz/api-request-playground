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
      <div className="text-center py-10 bg-surface/30 rounded-card border border-dashed border-border flex flex-col items-center justify-center">
        <p className="text-sm text-muted-text mb-4">No parameters configured.</p>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-text bg-elevated hover:bg-elevated/80 border border-border rounded-button transition-colors click-scale shadow-sm"
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
        <div key={item.id} className="flex items-center gap-3 group bg-surface/50 p-1.5 rounded-card border border-transparent hover:border-border transition-colors">
          <div className="text-muted-text opacity-0 group-hover:opacity-50 hover:opacity-100 cursor-grab px-1">
            <GripVertical size={14} />
          </div>
          
          <button
            onClick={() => onUpdate({ ...item, enabled: !item.enabled })}
            className={`w-5 h-5 flex-shrink-0 rounded-md border flex items-center justify-center transition-colors ${
              item.enabled 
                ? 'bg-accent border-accent text-primary-text' 
                : 'bg-elevated border-border text-transparent'
            }`}
          >
            <Check size={12} strokeWidth={3} />
          </button>
          
          <input
            type="text"
            value={item.key}
            onChange={(e) => onUpdate({ ...item, key: e.target.value })}
            placeholder={placeholderKey}
            className="flex-1 bg-elevated border border-border focus:border-accent/50 rounded-input px-3 py-2 text-sm text-primary-text placeholder-muted-text focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors font-mono shadow-sm"
            spellCheck={false}
          />
          
          <input
            type="text"
            value={item.value}
            onChange={(e) => onUpdate({ ...item, value: e.target.value })}
            placeholder={placeholderValue}
            className="flex-1 bg-elevated border border-border focus:border-accent/50 rounded-input px-3 py-2 text-sm text-primary-text placeholder-muted-text focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors font-mono shadow-sm"
            spellCheck={false}
          />
          
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 text-muted-text hover:text-danger hover:bg-danger/10 rounded-button transition-colors opacity-0 group-hover:opacity-100"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      
      <div className="pt-2 px-7">
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-text hover:text-primary-text hover:bg-elevated rounded-button transition-colors click-scale border border-transparent hover:border-border"
        >
          <Plus size={14} />
          Add Row
        </button>
      </div>
    </div>
  );
}