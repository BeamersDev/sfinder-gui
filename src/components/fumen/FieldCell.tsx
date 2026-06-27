import { useT } from '@/i18n/useTranslation';
import type { CellType } from '@/types/fumen';

interface FieldCellProps {
  type: CellType;
  x: number;
  y: number;
  cellSize?: number;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerEnter: (e: React.PointerEvent) => void;
  isSelected: boolean;
}

const PIECE_COLORS: Record<CellType, string> = {
  I: 'var(--piece-i)',
  O: 'var(--piece-o)',
  T: 'var(--piece-t)',
  S: 'var(--piece-s)',
  Z: 'var(--piece-z)',
  L: 'var(--piece-l)',
  J: 'var(--piece-j)',
  X: 'var(--piece-x)',
  _: 'var(--piece-empty)',
};

const PIECE_LABELS: Record<CellType, string> = {
  I: 'I', O: 'O', T: 'T', S: 'S', Z: 'Z', L: 'L', J: 'J', X: '', _: '',
};

export default function FieldCell({
  type, x, y, cellSize = 28, onPointerDown, onPointerEnter, isSelected,
}: FieldCellProps) {
  const t = useT();
  const color = PIECE_COLORS[type];
  const label = PIECE_LABELS[type];

  return (
    <div
      className={`
        relative flex items-center justify-center shrink-0 select-none touch-none
        border border-muted-foreground/25 text-[10px] font-bold
        hover:brightness-125 cursor-crosshair transition-[filter]
        ${isSelected ? 'ring-2 ring-yellow-400 ring-inset z-10 brightness-125 scale-105' : ''}
      `}
      style={{ width: cellSize, height: cellSize, backgroundColor: color, color: '#000' }}
      onPointerDown={(e) => { e.preventDefault(); onPointerDown(e); }}
      onPointerEnter={onPointerEnter}
      onContextMenu={(e) => e.preventDefault()}
      title={`${x},${y}: ${type} | ${t('editor.rClickErase')} | ${t('editor.ctrlFill')}`}
    >
      {label}
    </div>
  );
}
