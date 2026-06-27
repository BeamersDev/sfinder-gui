import { useFumenStore } from '@/stores/fumenStore';
import type { PageFlags } from '@/types/fumen';

const FLAGS: { key: keyof PageFlags; label: string }[] = [
  { key: 'colorize', label: 'Colorize' },
  { key: 'lock', label: 'Lock' },
  { key: 'mirror', label: 'Mirror' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'rise', label: 'Rise' },
];

export default function FlagToggles() {
  const pages = useFumenStore((s) => s.pages);
  const currentPageIndex = useFumenStore((s) => s.currentPageIndex);
  const setFlags = useFumenStore((s) => s.setFlags);

  const page = pages[currentPageIndex];
  const flags = page?.flags;

  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Flags
      </div>
      <div className="space-y-1">
        {FLAGS.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-2 text-xs cursor-pointer hover:text-foreground"
          >
            <input
              type="checkbox"
              checked={flags?.[key] ?? false}
              onChange={(e) => setFlags({ [key]: e.target.checked })}
              className="h-3.5 w-3.5 rounded border-border bg-background
                accent-primary focus:ring-1 focus:ring-ring"
            />
            <span className="text-muted-foreground">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
