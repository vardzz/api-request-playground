import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: unknown;
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle non-JSON gracefully and memoize syntax highlighting
  const { isJson, stringified, tokens, lineCount } = useMemo(() => {
    if (typeof data === 'string') {
      const lineCount = data.split('\n').length;
      return { isJson: false, stringified: data, tokens: [], lineCount };
    }

    try {
      const str = JSON.stringify(data, null, 2);
      const lineCount = str.split('\n').length;
      
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
        let cls = 'text-purple-400'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-cyan-400'; // key
          } else {
            cls = 'text-emerald-400'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-purple-400'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-zinc-500'; // null
        }
        
        parsedTokens.push(<span key={offset} className={cls}>{match}</span>);
        lastIndex = offset + match.length;
        
        return match;
      });
      
      // Add any remaining trailing text
      if (lastIndex < str.length) {
        parsedTokens.push(str.slice(lastIndex));
      }
      
      return { isJson: true, stringified: str, tokens: parsedTokens, lineCount };
    } catch {
      // Fallback if stringify fails for some reason
      const str = String(data);
      const lineCount = str.split('\n').length;
      return { isJson: false, stringified: str, tokens: [], lineCount };
    }
  }, [data]);

  const lines = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  return (
    <div className="flex h-full bg-[#0a0a0e] text-zinc-200 relative group text-xs leading-relaxed font-mono rounded-xl overflow-hidden">
      {/* Copy Button */}
      <button 
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors shadow-sm z-10 opacity-0 group-hover:opacity-100"
        title="Copy to clipboard"
      >
        {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
      </button>

      {/* Pseudo Gutter for Line Numbers */}
      <div className="flex flex-col items-end py-4 select-none overflow-hidden text-zinc-600 text-right pr-4 pl-4 border-r border-zinc-800/40">
        {lines.map(line => (
          <div key={line} className="h-[21px]">{line}</div>
        ))}
      </div>
      
      {/* Code Area */}
      <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <pre className="whitespace-pre selection:bg-purple-500/30" style={{ lineHeight: '21px' }}>
          {isJson ? tokens : stringified}
        </pre>
      </div>
    </div>
  );
}