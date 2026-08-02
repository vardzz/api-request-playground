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

  return (
    <div className="flex flex-col gap-2">
      {items.length === 0 ? (
        <div className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-300 rounded-md">
          No items added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <label className="flex items-center justify-center p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) => onUpdate({ ...item, enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </label>
              
              <input
                type="text"
                placeholder="Key"
                value={item.key}
                onChange={(e) => onUpdate({ ...item, key: e.target.value })}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              
              <input
                type="text"
                placeholder="Value"
                value={item.value}
                onChange={(e) => onUpdate({ ...item, value: e.target.value })}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              
              <button
                onClick={() => onRemove(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Remove row"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-2">
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          <Plus size={16} />
          Add Row
        </button>
      </div>
    </div>
  );
}