import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RadioButton, Text, MD3Theme } from 'react-native-paper';
import { CustomCard } from '@/src/widgets/CustomCard';
import { SettingsSection } from '@/src/components/SettingsSection';
import { useTranslation } from '@/src/i18n/useTranslation';
import { detectLocale } from '@/src/i18n/index';

interface LanguageSectionProps {
  theme: MD3Theme;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'da', label: 'Dansk', flag: '🇩🇰' },
  { code: 'is', label: 'Íslenska', flag: '🇮🇸' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'no', label: 'Norsk', flag: '🇳🇴' },
];

const FLAG_BY_CODE: Record<string, string> = {};
for (const l of LANGUAGES) FLAG_BY_CODE[l.code] = l.flag;

export function LanguageSection({ theme, language, onLanguageChange }: LanguageSectionProps) {
  const { t } = useTranslation();

  const systemLang = detectLocale();
  const systemFlag = FLAG_BY_CODE[systemLang] || '🌐';
  const currentLabel = language === 'auto'
    ? `${systemFlag} ${LANGUAGES.find(l => l.code === systemLang)?.label || systemLang}`
    : null;

  return (
    <SettingsSection title={t('language.title')} theme={theme}>
      <CustomCard glass style={styles.langCard}>
        {currentLabel && (
          <View style={[styles.autoBadge, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              Auto: {currentLabel}
            </Text>
          </View>
        )}
        <RadioButton.Group onValueChange={onLanguageChange} value={language}>
          <RadioButton.Item
            label="🌐  Auto (System)"
            value="auto"
          />
          {LANGUAGES.map((lang) => (
            <RadioButton.Item
              key={lang.code}
              label={`${lang.flag}  ${lang.label}`}
              value={lang.code}
            />
          ))}
        </RadioButton.Group>
      </CustomCard>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  langCard: { paddingHorizontal: 4, paddingVertical: 4 },
  autoBadge: {
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
});
