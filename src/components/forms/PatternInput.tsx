import { HelpCircle, Trash2 } from 'lucide-react';
import { useT } from '@/i18n/useTranslation';

interface PatternInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PIECES = ['I', 'O', 'T', 'L', 'J', 'S', 'Z'];
const PIECE_COLORS: Record<string, string> = {
  I: 'var(--piece-i)', O: 'var(--piece-o)', T: 'var(--piece-t)',
  L: 'var(--piece-l)', J: 'var(--piece-j)', S: 'var(--piece-s)', Z: 'var(--piece-z)',
};

export default function PatternInput({ value, onChange }: PatternInputProps) {
  const t = useT();

  const PATTERN_HELP = t('patterns.help');

const PRESETS = [
  { label: '*p7', value: '*p7' },
  { label: '[ILSZTOJ]p7', value: '[ILSZTOJ]p7' },
  { label: '[]p', value: '[]p' },
  { label: '*p', value: '*p' },
];

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center gap-1.5">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {t('patterns.label')}
        </label>
        <div className="group relative">
          <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
          <div
            className="absolute bottom-full left-0 mb-2 w-64 rounded-md border border-border bg-popover p-3
              text-xs text-popover-foreground shadow-lg opacity-0 invisible group-hover:opacity-100
              group-hover:visible transition-all z-50 whitespace-pre-wrap font-mono leading-relaxed"
          >
            {PATTERN_HELP}
          </div>
        </div>
      </div>

      {/* Raw text input — source of truth */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('patterns.placeholder')}
        spellCheck={false}
        className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 font-mono text-sm
          placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
      />

      {/* Visual helpers */}
      <div className="rounded-md border border-border bg-card p-2 space-y-2">
        {/* Presets */}
        <div className="flex flex-wrap gap-1">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                const newVal = value ? `${value},${preset.value}` : preset.value;
                onChange(newVal);
              }}
              className="rounded px-2 py-0.5 text-xs font-mono transition-colors
                bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Piece buttons — append to current value */}
        <div className="flex items-center gap-1">
          {PIECES.map((piece) => (
            <button
              key={piece}
              onClick={() => {
                const newVal = value ? `${value},${piece}` : piece;
                onChange(newVal);
              }}
              className="flex items-center justify-center h-8 w-8 rounded text-xs font-bold
                hover:brightness-125 hover:scale-110 transition-all"
              style={{ backgroundColor: PIECE_COLORS[piece], color: '#000' }}
              title={`Append ${piece}`}
            >
              {piece}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={() => onChange('')}
            className="flex items-center justify-center h-8 w-8 rounded text-xs text-red-400
              hover:bg-red-500/15 transition-colors"
            title="Clear patterns"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
