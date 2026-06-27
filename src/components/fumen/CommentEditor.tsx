import { useFumenStore } from '@/stores/fumenStore';
import { useT } from '@/i18n/useTranslation';

export default function CommentEditor() {
  const t = useT();
  const pages = useFumenStore((s) => s.pages);
  const currentPageIndex = useFumenStore((s) => s.currentPageIndex);
  const setComment = useFumenStore((s) => s.setComment);

  const page = pages[currentPageIndex];
  const comment = page?.comment ?? '';

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {t('editor.comment')}
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="Page comment..."
        className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-xs
          placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}
