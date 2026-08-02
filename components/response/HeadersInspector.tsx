interface HeadersInspectorProps {
  headers: Record<string, string>;
}

export default function HeadersInspector({ headers }: HeadersInspectorProps) {
  const entries = Object.entries(headers);

  if (entries.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-6 text-center border border-dashed border-gray-300 rounded-md">
        No headers returned in response.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
          <tr>
            <th className="px-4 py-2.5 w-1/3">Header Name</th>
            <th className="px-4 py-2.5 w-2/3">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {entries.map(([key, value]) => (
            <tr key={key} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2 font-mono text-blue-700 whitespace-nowrap align-top">{key}</td>
              <td className="px-4 py-2 font-mono text-gray-800 break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}