import { useAppStore } from '@/stores/appStore';
import { t } from './translations';
import type { Lang } from './translations';

export function useT() {
  const lang = (useAppStore((s) => s.settings.language) || 'en') as Lang;
  return (key: string) => t(lang, key);
}
