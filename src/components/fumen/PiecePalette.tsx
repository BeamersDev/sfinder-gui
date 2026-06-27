import { useFumenStore } from '@/stores/fumenStore';
import type { CellType } from '@/types/fumen';
import { Eraser } from 'lucide-react';
import { useT } from '@/i18n/useTranslation';

const PIECES: { type: CellType; label: string; color: string }[] = [
  { type: 'T', label: 'T', color: 'var(--piece-t)' },
  { type: 'I', label: 'I', color: 'var(--piece-i)' },
  { type: 'O', label: 'O', color: 'var(--piece-o)' },
  { type: 'L', label: 'L', color: 'var(--piece-l)' },
  { type: 'J', label: 'J', color: 'var(--piece-j)' },
  { type: 'S', label: 'S', color: 'var(--piece-s)' },
  { type: 'Z', label: 'Z', color: 'var(--piece-z)' },
  { type: 'X', label: 'G', color: 'var(--piece-x)' },
];

export default function PiecePalette() {
  const selectedTool = useFumenStore((s) => s.selectedTool);
  const setTool = useFumenStore((s) => s.setTool);

  const isPieceSelected = (pieceType: CellType) =>
    selectedTool.type === 'paint' && selectedTool.pieceType === pieceType;

  const t = useT();
  const isErasing = selectedTool.type === 'erase';

  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2 w-fit">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {t('editor.pieces')}
      </div>

      {/* Piece buttons — fixed square */}
      <div className="flex flex-wrap gap-1.5">
        {PIECES.map((piece) => {
          const active = isPieceSelected(piece.type);
          return (
            <button
              key={piece.type}
              onClick={() =>
                setTool({
                  type: 'paint',
                  pieceType: piece.type,
                  rotation: 'spawn',
                })
              }
              className={`
                flex items-center justify-center w-10 h-10 rounded-md text-xs font-bold transition-all shrink-0
                ${active ? 'ring-2 ring-primary ring-offset-1 ring-offset-card scale-105' : 'hover:brightness-125'}
              `}
              style={{ backgroundColor: piece.color, color: '#000' }}
              title={piece.type === 'X' ? 'Gray/Garbage' : piece.label}
            >
              {piece.label}
            </button>
          );
        })}
      </div>

      {/* Erase button — same height as piece buttons */}
      <button
        onClick={() => setTool({ type: 'erase' })}
        className={`
          flex items-center justify-center gap-1.5 w-full h-10 rounded-md text-xs font-bold transition-all
          ${isErasing
            ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-card bg-red-500/30 text-red-300'
            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}
        `}
      >
        <Eraser className="h-3.5 w-3.5" />
        {t('editor.erase')}
      </button>
    </div>
  );
}
