import { useLocation } from 'react-router-dom';
import { useT } from '@/i18n/useTranslation';

export default function Header() {
  const t = useT();
  const location = useLocation();
  const routeTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/fumen-editor': t('sidebar.fumenEditor'),
    '/settings': t('sidebar.settings'),
    '/percent': t('sidebar.percent'),
    '/path': t('sidebar.path'),
    '/setup': t('sidebar.setup'),
    '/ren': t('sidebar.ren'),
    '/spin': t('sidebar.spin'),
    '/cover': t('sidebar.cover'),
  };
  const title = routeTitles[location.pathname] ?? 'sfinder-gui';

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-card/50 px-6">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
    </header>
  );
}
