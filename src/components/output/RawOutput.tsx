import { Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

interface RawOutputProps {
  text: string;
}

export default function RawOutput({ text }: RawOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallthrough
    }
  }, [text]);

  if (!text || text.trim().length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No output.
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-secondary px-2 py-1
          text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copy
          </>
        )}
      </button>
      <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-muted-foreground
        bg-background rounded-md border border-border p-4 max-h-[500px] overflow-y-auto">
        {text}
      </pre>
    </div>
  );
}
