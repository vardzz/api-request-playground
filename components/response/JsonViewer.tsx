import { useMemo } from 'react';

interface JsonViewerProps {
  data: unknown;
}

export default function JsonViewer({ data }: JsonViewerProps) {
  // Pitfall #5 & #7: Handle non-JSON gracefully and memoize syntax highlighting
  const { isJson, stringified, tokens } = useMemo(() => {
    if (typeof data === 'string') {
      return { isJson: false, stringified: data, tokens: [] };
    }

    try {
      const str = JSON.stringify(data, null, 2);
      // Basic JSON tokenizer for syntax highlighting
      // Matches: Strings (keys or values), booleans, null, numbers
      const jsonRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
      
      const parsedTokens: React.ReactNode[] = [];
      let lastIndex = 0;
      
      str.replace(jsonRegex, (match, p1, p2, p3, offset) => {
        // Add preceding raw text
        if (offset > lastIndex) {
          parsedTokens.push(str.slice(lastIndex, offset));
        }
        
        // Determine token type
        let cls = 'text-blue-600'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-purple-600 font-semibold'; // key
          } else {
            cls = 'text-green-600'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-orange-500 font-semibold'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-gray-500 font-bold'; // null
        }
        
        parsedTokens.push(<span key={offset} className={cls}>{match}</span>);
        lastIndex = offset + match.length;
        
        return match;
      });
      
      // Add any remaining trailing text
      if (lastIndex < str.length) {
        parsedTokens.push(str.slice(lastIndex));
      }
      
      return { isJson: true, stringified: str, tokens: parsedTokens };
    } catch {
      // Fallback if stringify fails for some reason
      return { isJson: false, stringified: String(data), tokens: [] };
    }
  }, [data]);

  return (
    <div className="bg-[#fafafa] rounded-md border border-gray-200 overflow-x-auto text-sm p-4 font-mono leading-relaxed h-full">
      <pre className="whitespace-pre">
        {isJson ? tokens : stringified}
      </pre>
    </div>
  );
}