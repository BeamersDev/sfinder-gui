import { Link } from 'react-router-dom';
import { Percent, Route, Edit3, Zap, Wrench, RotateCw, LayoutGrid, Scan, Play } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useCommandStore } from '@/stores/commandStore';
import { useT } from '@/i18n/useTranslation';

const quickActions = [
  { to: '/fumen-editor', label: 'Fumen Editor', icon: Edit3, desc: 'Edit Tetris fields visually' },
  { to: '/percent', label: 'Percent', icon: Percent, desc: 'Calculate PC probability' },
  { to: '/path', label: 'Path', icon: Route, desc: 'Find all PC solutions' },
  { to: '/setup', label: 'Setup', icon: Wrench, desc: 'Find setup fills' },
  { to: '/ren', label: 'Ren', icon: Zap, desc: 'Continue combos' },
  { to: '/spin', label: 'Spin', icon: RotateCw, desc: 'Find T-spin solutions' },
  { to: '/cover', label: 'Cover', icon: LayoutGrid, desc: 'Coverage analysis' },
  { to: '/recognize', label: 'Recognize', icon: Scan, desc: 'Recognize field from screenshot' },
];

export default function HomePage() {
  const t = useT();
  const javaInfo = useAppStore((s) => s.javaInfo);
  const jarInfo = useAppStore((s) => s.sfinderJarInfo);
  const recentCommands = useCommandStore((s) => s.recentCommands);

  const ready = javaInfo.installed && jarInfo.found;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{t('home.welcome')}</h2>
        <p className="text-muted-foreground">{t('home.desc')}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${javaInfo.installed ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <div className="font-medium text-sm">{t('home.javaRuntime')}</div>
              <div className="text-xs text-muted-foreground">
                {javaInfo.installed ? (javaInfo.version ?? t('home.installed')) : t('home.notFound')}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${jarInfo.found ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <div>
              <div className="font-medium text-sm">{t('home.sfinderJar')}</div>
              <div className="text-xs text-muted-foreground">
                {jarInfo.found ? t('home.ready') : t('home.notConfigured')}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!ready && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
          {t('home.notReady')}{' '}
          <Link to="/settings" className="underline font-medium">{t('home.configInSettings')}</Link>
        </div>
      )}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {t('home.quickActions')}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-5 w-5 text-foreground/70 group-hover:text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{action.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Commands */}
      {recentCommands.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t('home.recentCommands')}
          </h3>
          <div className="space-y-2">
            {recentCommands.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2 text-sm"
              >
                <Play className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs text-primary">{entry.config.command}</span>
                <span className="text-muted-foreground truncate">{entry.output.commandLine}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
