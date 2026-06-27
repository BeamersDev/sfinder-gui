import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Percent, Route, Wrench, Zap, RotateCw, Settings, Home, Edit3 } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useT } from '@/i18n/useTranslation';

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  shortcut?: string;
}

export default function Sidebar() {
  const t = useT();
  const location = useLocation();
  const javaInfo = useAppStore((s) => s.javaInfo);
  const jarInfo = useAppStore((s) => s.sfinderJarInfo);

  const navGroups: { label: string; items: NavItem[] }[] = [
    {
      label: t('sidebar.tools'),
      items: [
        { to: '/fumen-editor', label: t('sidebar.fumenEditor'), icon: Edit3, shortcut: '1' },
      ],
    },
    {
      label: t('sidebar.commands'),
      items: [
        { to: '/percent', label: t('sidebar.percent'), icon: Percent, shortcut: '2' },
        { to: '/path', label: t('sidebar.path'), icon: Route, shortcut: '3' },
        { to: '/setup', label: t('sidebar.setup'), icon: Wrench, shortcut: '4' },
        { to: '/ren', label: t('sidebar.ren'), icon: Zap, shortcut: '5' },
        { to: '/spin', label: t('sidebar.spin'), icon: RotateCw, shortcut: '6' },
        { to: '/cover', label: t('sidebar.cover'), icon: LayoutGrid, shortcut: '7' },
      ],
    },
    {
      label: t('sidebar.system'),
      items: [
        { to: '/settings', label: t('sidebar.settings'), icon: Settings },
      ],
    },
  ];

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
          <LayoutGrid className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm">sfinder-gui</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {group.label}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`
                    mx-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors
                    ${isActive
                      ? 'bg-primary/15 text-primary font-medium'
                      : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="ml-auto text-xs text-muted-foreground font-mono">
                      {item.shortcut}
                    </kbd>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Status Footer */}
      <div className="border-t border-border p-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              javaInfo.installed ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-muted-foreground">
            Java {javaInfo.installed ? (javaInfo.version ?? t('home.installed')) : t('home.notFound')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              jarInfo.found ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
          <span className="text-muted-foreground">
            sfinder.jar {jarInfo.found ? t('home.ready') : t('home.notConfigured')}
          </span>
        </div>
      </div>
    </aside>
  );
}
