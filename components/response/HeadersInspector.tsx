interface HeadersInspectorProps {
  headers: Record<string, string>;
}

export default function HeadersInspector({ headers }: HeadersInspectorProps) {
  const entries = Object.entries(headers);

  if (entries.length === 0) {
    return (
      <div className="text-sm text-zinc-500 py-6 text-center border border-dashed border-zinc-800 rounded-md">
        No headers returned in response.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-zinc-800 bg-[#1e1e1e]">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-semibold">
          <tr>
            <th className="px-4 py-2.5 w-1/3">Header Name</th>
            <th className="px-4 py-2.5 w-2/3">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {entries.map(([key, value]) => (
            <tr key={key} className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-4 py-2 font-mono text-cyan-400 whitespace-nowrap align-top">{key}</td>
              <td className="px-4 py-2 font-mono text-zinc-300 break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}