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
        let cls = 'text-warning'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-accent font-medium'; // key
          } else {
            cls = 'text-success'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-[#8B5CF6] font-medium'; // boolean (purple)
        } else if (/null/.test(match)) {
          cls = 'text-danger font-medium'; // null (red)
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
    <div className="flex h-full bg-background relative group text-[13px] leading-relaxed">
      {/* Copy Button */}
      <button 
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-elevated border border-border rounded-button text-muted-text hover:text-primary-text hover:border-border/80 transition-colors shadow-sm z-10 click-scale opacity-0 group-hover:opacity-100"
        title="Copy to clipboard"
      >
        {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
      </button>

      {/* Pseudo Gutter for Line Numbers */}
      <div className="w-12 bg-surface/30 border-r border-border flex flex-col items-end py-4 select-none overflow-hidden font-mono text-muted-text/50">
        {lines.map(line => (
          <div key={line} className="pr-3 h-[21px]">{line}</div>
        ))}
      </div>
      
      {/* Code Area */}
      <div className="flex-1 overflow-x-auto p-4 font-mono scrollbar-thin scrollbar-thumb-elevated scrollbar-track-transparent">
        <pre className="whitespace-pre text-primary-text selection:bg-accent/30" style={{ lineHeight: '21px' }}>
          {isJson ? tokens : stringified}
        </pre>
      </div>
    </div>
  );
}