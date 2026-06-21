import { useState, useCallback, useEffect } from 'react';
import i18n, { detectLocale } from './index';
import { useSettingsStore } from '../store/settingsStore';

export function useTranslation() {
  const storeLanguage = useSettingsStore((s) => s.language);
  const [locale, setLocaleState] = useState(i18n.locale);

  useEffect(() => {
    const target = storeLanguage === 'auto' || !storeLanguage
      ? detectLocale()
      : storeLanguage;
    if (target && target !== i18n.locale) {
      i18n.locale = target;
      setLocaleState(target);
    }
  }, [storeLanguage]);

  const setLocale = useCallback((newLocale: string) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: string, options?: Record<string, any>) => {
      return i18n.t(key, options) ?? key;
    },
    [locale],
  );

  return { t, locale, setLocale };
}
