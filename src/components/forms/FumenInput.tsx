import { useState } from 'react';
import { Link2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FumenInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function FumenInput({
  value,
  onChange,
  label = 'Fumen String (tetfu)',
  placeholder = 'v115@...',
}: FumenInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setError(null);

    // Basic validation on blur or when user stops typing
    const clean = newValue.trim();
    if (clean && !clean.startsWith('v115@') && !clean.startsWith('v110@') && !clean.includes('@')) {
      // It might be missing the version prefix
    }
  };

  const handleBlur = () => {
    onChange(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onChange(localValue);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <textarea
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder={placeholder}
          spellCheck={false}
          className={`
            w-full resize-none rounded-md border bg-background px-2.5 py-1.5 font-mono text-xs
            placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-input focus:ring-ring'}
          `}
        />
        {error && (
          <div className="flex items-center gap-1 mt-1 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
