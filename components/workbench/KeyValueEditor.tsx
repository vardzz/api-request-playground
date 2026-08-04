'use client';

import { KeyValuePair } from '../../types';
import { Plus, Trash2, Check, ListPlus } from 'lucide-react';

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

  const updateItem = (id: string, updates: Partial<KeyValuePair>) => {
    const item = items.find(i => i.id === id);
    if (item) {
      onUpdate({ ...item, ...updates });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F1115]">
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-[#F4F1EA]/20 mb-3">
            <ListPlus size={32} strokeWidth={1.5} />
          </div>
          <p className="text-sm text-[#F4F1EA]/70 font-medium mb-1">No parameters configured</p>
          <p className="text-xs text-[#F4F1EA]/40 mb-6 max-w-xs">
            Add parameters manually, or send a request to populate this from your history.
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#F4F1EA] bg-[#0F1115] hover:bg-[#F4F1EA]/10 border border-[#F4F1EA]/20 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Parameter
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 p-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 group relative">
              {/* Custom Checkbox */}
              <button
                onClick={() => updateItem(item.id, { enabled: !item.enabled })}
                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                  item.enabled
                    ? 'bg-[#F4F1EA] border-[#F4F1EA] text-[#0F1115]'
                    : 'bg-[#0F1115] border-[#F4F1EA]/20 text-transparent'
                }`}
              >
                <Check size={12} strokeWidth={3} />
              </button>

              <input
                type="text"
                value={item.key}
                onChange={(e) => updateItem(item.id, { key: e.target.value })}
                placeholder={placeholderKey}
                className="flex-1 bg-[#0F1115] border border-[#F4F1EA]/20 text-[#F4F1EA] text-sm rounded-lg px-3 py-2 focus:border-[#F4F1EA]/50 placeholder:text-[#F4F1EA]/30 focus:outline-none transition-colors font-mono"
                spellCheck={false}
              />
              
              <input
                type="text"
                value={item.value}
                onChange={(e) => updateItem(item.id, { value: e.target.value })}
                placeholder={placeholderValue}
                className="flex-1 bg-[#0F1115] border border-[#F4F1EA]/20 text-[#F4F1EA] text-sm rounded-lg px-3 py-2 focus:border-[#F4F1EA]/50 placeholder:text-[#F4F1EA]/30 focus:outline-none transition-colors font-mono"
                spellCheck={false}
              />
              
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity absolute right-[-24px]">
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 text-[#F4F1EA]/50 hover:text-[#F4F1EA] transition-colors"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={handleAdd}
            className="text-[#F4F1EA]/50 hover:text-[#F4F1EA] text-sm flex items-center gap-1.5 mt-3 transition-colors"
          >
            <Plus size={14} /> Add Param
          </button>
        </div>
      )}
    </div>
  );
}