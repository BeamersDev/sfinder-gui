import { useFumenStore } from '@/stores/fumenStore';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

export default function PageNavigator() {
  const pages = useFumenStore((s) => s.pages);
  const currentPageIndex = useFumenStore((s) => s.currentPageIndex);
  const goToPage = useFumenStore((s) => s.goToPage);
  const addPage = useFumenStore((s) => s.addPage);
  const deletePage = useFumenStore((s) => s.deletePage);

  const totalPages = pages.length;
  const canDelete = totalPages > 1;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => goToPage(currentPageIndex - 1)}
        disabled={currentPageIndex <= 0}
        className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground
          hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="min-w-[80px] text-center text-sm font-mono">
        Page {currentPageIndex + 1}/{totalPages}
      </span>

      <button
        onClick={() => goToPage(currentPageIndex + 1)}
        disabled={currentPageIndex >= totalPages - 1}
        className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground
          hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={addPage}
        className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground
          hover:bg-secondary hover:text-foreground"
        title="Add page"
      >
        <Plus className="h-4 w-4" />
      </button>

      <button
        onClick={deletePage}
        disabled={!canDelete}
        className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground
          hover:bg-red-500/15 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Delete page"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
