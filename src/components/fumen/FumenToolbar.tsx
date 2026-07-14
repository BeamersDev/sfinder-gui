import { useFumenStore } from '@/stores/fumenStore';
import { Trash2, Undo2, Redo2, ArrowLeftRight, ArrowUpDown, ArrowLeft, Copy, ClipboardPaste, FilePlus, Camera } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useT } from '@/i18n/useTranslation';
import { invoke } from '@tauri-apps/api/core';
import { Field, encoder } from 'tetris-fumen';

const PIECE_CHARS = new Set(['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'X']);

/** Convert a recognized field string (lines of 10 chars) to a fumen code */
function fieldStrToFumen(fieldStr: string): string | null {
  const lines = fieldStr.trim().split('\n').filter(Boolean);
  if (lines.length === 0 || lines[0].length !== 10) return null;
  try {
    const field = Field.create('_'.repeat(10 * 23), '_'.repeat(10));
    for (let row = 0; row < lines.length; row++) {
      const line = lines[lines.length - 1 - row]; // reverse for fumen coords
      for (let col = 0; col < 10; col++) {
        const ch = line[col];
        if (PIECE_CHARS.has(ch)) field.set(col, row, ch as any);
      }
    }
    return encoder.encode([{ field }]);
  } catch {
    return null;
  }
}

export default function FumenToolbar() {
  const t = useT();
  const [capturing, setCapturing] = useState(false);
  const clearField = useFumenStore((s) => s.clearField);
  const newFile = useFumenStore((s) => s.newFile);
  const undo = useFumenStore((s) => s.undo);
  const redo = useFumenStore((s) => s.redo);
  const flipHorizontal = useFumenStore((s) => s.flipHorizontal);
  const flipVertical = useFumenStore((s) => s.flipVertical);
  const mirrorField = useFumenStore((s) => s.mirrorField);
  const fumenString = useFumenStore((s) => s.fumenString);
  const decodeFumen = useFumenStore((s) => s.decodeFumen);
  const undoStack = useFumenStore((s) => s.undoStack);
  const redoStack = useFumenStore((s) => s.redoStack);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fumenString);
    } catch { /* fallback silently */ }
  }, [fumenString]);

  const handleImport = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) decodeFumen(text);
    } catch { /* fallback silently */ }
  }, [decodeFumen]);

  const handleScreenshot = useCallback(async () => {
    setCapturing(true);
    try {
      const fieldStr = await invoke<string>('capture_and_recognize');
      const fumen = fieldStrToFumen(fieldStr);
      if (fumen) decodeFumen(fumen);
    } catch (err) {
      console.error('Screenshot capture failed:', err);
    } finally {
      setCapturing(false);
    }
  }, [decodeFumen]);

  const actions = [
    { icon: FilePlus, label: t('editor.new'), onClick: newFile },
    { type: 'separator' as const },
    { icon: Camera, label: 'Screenshot', onClick: handleScreenshot },
    { type: 'separator' as const },
    { icon: Undo2, label: t('editor.undo'), onClick: undo, disabled: undoStack.length === 0 },
    { icon: Redo2, label: t('editor.redo'), onClick: redo, disabled: redoStack.length === 0 },
    { type: 'separator' as const },
    { icon: ArrowLeftRight, label: t('editor.flipH'), onClick: flipHorizontal },
    { icon: ArrowUpDown, label: t('editor.flipV'), onClick: flipVertical },
    { icon: ArrowLeft, label: t('editor.mirror'), onClick: mirrorField },
    { type: 'separator' as const },
    { icon: Copy, label: t('editor.copyFumen'), onClick: handleCopy },
    { icon: ClipboardPaste, label: t('editor.importFumen'), onClick: handleImport },
    { type: 'separator' as const },
    { icon: Trash2, label: t('editor.clearField'), onClick: clearField, danger: true },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1.5">
      {actions.map((action, i) => {
        if ('type' in action && action.type === 'separator') {
          return <div key={i} className="w-px h-6 bg-border mx-1" />;
        }
        const { icon: Icon, label, onClick, disabled, danger } = action as {
          icon: typeof Trash2;
          label: string;
          onClick: () => void;
          disabled?: boolean;
          danger?: boolean;
        };
        return (
          <button
            key={label}
            onClick={onClick}
            disabled={disabled || capturing}
            title={label}
            className={`
              flex items-center justify-center h-8 w-8 rounded-md text-xs transition-colors
              ${disabled || capturing
                ? capturing ? 'animate-pulse text-primary' : 'text-muted-foreground/30 cursor-not-allowed'
                : danger
                  ? 'text-muted-foreground hover:bg-red-500/15 hover:text-red-400'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }
            `}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
