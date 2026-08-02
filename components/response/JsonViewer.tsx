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
      
      str.replace(jsonRegex, (...args) => {
        const match = args[0];
        const offset = args[args.length - 2] as number;
        
        // Add preceding raw text
        if (offset > lastIndex) {
          parsedTokens.push(str.slice(lastIndex, offset));
        }
        
        // Determine token type
        let cls = 'text-amber-400'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-cyan-400 font-medium'; // key
          } else {
            cls = 'text-emerald-400'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-amber-500 font-medium'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-zinc-500 font-bold'; // null
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
    <div className="bg-[#1e1e1e] rounded-md border border-zinc-800 overflow-x-auto text-sm p-4 font-mono leading-relaxed h-full scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
      <pre className="whitespace-pre text-zinc-300">
        {isJson ? tokens : stringified}
      </pre>
    </div>
  );
}