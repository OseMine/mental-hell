import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import de from './de';
import en from './en';
import fr from './fr';
import es from './es';
import cs from './cs';
import ru from './ru';
import it from './it';
import pt from './pt';
import da from './da';
import is from './is';
import sv from './sv';
import no from './no';

const SUPPORTED = ['de', 'en', 'fr', 'es', 'cs', 'ru', 'it', 'pt', 'da', 'is', 'sv', 'no'];

function detectLocale(): string {
  try {
    const locales = getLocales();
    if (locales && locales.length > 0) {
      const code = locales[0].languageCode?.toLowerCase();
      if (code && SUPPORTED.includes(code)) return code;
    }
  } catch {}
  return 'en';
}

const i18n = new I18n({ de, en, fr, es, cs, ru, it, pt, da, is, sv, no });
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.locale = detectLocale();

export default i18n;
export { detectLocale };
export { SUPPORTED as SUPPORTED_LANGUAGES };
