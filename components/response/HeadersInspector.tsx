interface HeadersInspectorProps {
  headers: Record<string, string>;
}

export default function HeadersInspector({ headers }: HeadersInspectorProps) {
  const entries = Object.entries(headers);

  if (entries.length === 0) {
    return (
      <div className="text-sm text-muted-text py-10 flex flex-col items-center justify-center border border-dashed border-border rounded-card bg-surface/30">
        No headers returned in response.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-elevated border-b border-border text-secondary-text font-semibold text-[11px] uppercase tracking-wider">
          <tr>
            <th className="px-5 py-3 w-1/3">Header Name</th>
            <th className="px-5 py-3 w-2/3">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map(([key, value]) => (
            <tr key={key} className="hover:bg-elevated/50 transition-colors group">
              <td className="px-5 py-2.5 font-mono text-[13px] text-accent whitespace-nowrap align-top select-all">{key}</td>
              <td className="px-5 py-2.5 font-mono text-[13px] text-primary-text break-all select-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}