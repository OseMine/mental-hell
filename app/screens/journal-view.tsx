import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, useTheme, Button, MD3Theme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHealthStore } from '@/src/store/healthStore';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { useTranslation } from '@/src/i18n/useTranslation';
import { getDateFormatted, formatTime } from '@/src/utils/formatters';
import { router, useLocalSearchParams } from 'expo-router';

const MOOD_EMOJIS: Record<string, string> = {
  '1': '😞', '2': '😔', '3': '😐', '4': '🙂', '5': '😊',
  '6': '😌', '7': '😄', '8': '🤗', '9': '🥰', '10': '🤩',
};

export default function JournalViewScreen() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { getJournalEntry } = useHealthStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = id ? getJournalEntry(id) : undefined;

  if (!entry) {
    return (
      <Background>
        <CustomCard glass>
          <Text variant="bodyLarge" style={{ textAlign: 'center', paddingVertical: 32, color: theme.colors.outline }}>
            Entry not found
          </Text>
          <Button mode="text" onPress={() => router.back()}>{t('common.back')}</Button>
        </CustomCard>
      </Background>
    );
  }

  return (
    <Background scrollable={true}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400).springify().damping(22).stiffness(180)}>
          <CustomCard glass>
            <View style={styles.headerRow}>
              <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                {entry.title}
              </Text>
              <Text variant="titleLarge" style={{ fontSize: 32 }}>
                {MOOD_EMOJIS[String(Math.round(entry.mood_score))] || '😐'}
              </Text>
            </View>

            <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 16 }}>
              {getDateFormatted(new Date(entry.created_at))} · {t('journal.updatedAt', { time: formatTime(entry.updated_at) })}
            </Text>

            {entry.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {entry.tags.map((tag, i) => (
                  <View key={i} style={[styles.tag, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={[styles.divider, { borderBottomColor: theme.colors.outlineVariant }]} />

            <Text variant="bodyLarge" style={[styles.content, { color: theme.colors.onSurface }]}>
              {entry.content}
            </Text>
          </CustomCard>
        </Animated.View>

        <Button
          mode="contained"
          icon="pencil"
          onPress={() => router.push(`/screens/journal-editor?id=${entry.id}`)}
          style={styles.editBtn}
        >
          {t('journal.editEntry')}
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={{ marginBottom: 24 }}
        >
          {t('common.back')}
        </Button>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: { fontWeight: '800', flex: 1, marginRight: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 },
  divider: { borderBottomWidth: 1, marginVertical: 16 },
  content: { lineHeight: 26, fontSize: 16 },
  editBtn: { marginTop: 20, borderRadius: 100, marginBottom: 8 },
});