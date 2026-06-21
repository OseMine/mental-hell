import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, ScrollView, Alert } from 'react-native';
import { Text, useTheme, Button, MD3Theme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { useHealthStore } from '@/src/store/healthStore';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { useTranslation } from '@/src/i18n/useTranslation';
import { router, useLocalSearchParams } from 'expo-router';

export default function JournalEditorScreen() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { addJournalEntry, updateJournalEntry, getJournalEntry } = useHealthStore();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodScore, setMoodScore] = useState(5);
  const [tags, setTags] = useState('');

  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      const entry = getJournalEntry(id);
      if (entry) {
        setTitle(entry.title);
        setContent(entry.content);
        setMoodScore(entry.mood_score);
        setTags(entry.tags.join(', '));
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('', t('journal.entryTitlePlaceholder'));
      return;
    }

    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (isEditing && id) {
      updateJournalEntry(id, {
        title: title.trim(),
        content: content.trim(),
        mood_score: moodScore,
        tags: tagArray,
      });
    } else {
      addJournalEntry({
        title: title.trim(),
        content: content.trim(),
        mood_score: moodScore,
        tags: tagArray,
      });
    }

    router.back();
  };

  const MOOD_LABELS = [
    t('mood.veryBad'),
    t('mood.bad'),
    t('mood.neutral'),
    t('mood.good'),
    t('mood.veryGood'),
  ];

  return (
    <Background scrollable={true}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
            {isEditing ? t('journal.editEntry') : t('journal.newEntry')}
          </Text>
        </View>

        <Animated.View entering={FadeInDown.duration(400).springify().damping(22).stiffness(180)}>
          <CustomCard glass>
            <Text variant="labelLarge" style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
              {t('journal.entryTitle')}
            </Text>
            <TextInput
              style={[styles.titleInput, {
                backgroundColor: theme.colors.surfaceVariant,
                color: theme.colors.onSurface,
                borderColor: theme.colors.outlineVariant,
              }]}
              placeholder={t('journal.entryTitlePlaceholder')}
              placeholderTextColor={theme.colors.outline}
              value={title}
              onChangeText={setTitle}
            />

            <Text variant="labelLarge" style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
              {t('journal.entryContent')}
            </Text>
            <TextInput
              style={[styles.contentInput, {
                backgroundColor: theme.colors.surfaceVariant,
                color: theme.colors.onSurface,
                borderColor: theme.colors.outlineVariant,
              }]}
              placeholder={t('journal.entryContentPlaceholder')}
              placeholderTextColor={theme.colors.outline}
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
            />

            <Text variant="labelLarge" style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
              {t('journal.moodLabel')}
            </Text>
            <View style={styles.sliderRow}>
              <Slider
                style={{ flex: 1, height: 40 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={moodScore}
                onValueChange={setMoodScore}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.surfaceVariant}
                thumbTintColor={theme.colors.primary}
              />
              <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700', width: 30, textAlign: 'center' }}>
                {moodScore}
              </Text>
            </View>
            <Text variant="bodySmall" style={{ color: theme.colors.outline, textAlign: 'center', marginBottom: 12 }}>
              {MOOD_LABELS[Math.min(Math.floor((moodScore - 1) / 2), 4)]}
            </Text>

            <Text variant="labelLarge" style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
              {t('journal.tagsLabel')}
            </Text>
            <TextInput
              style={[styles.tagsInput, {
                backgroundColor: theme.colors.surfaceVariant,
                color: theme.colors.onSurface,
                borderColor: theme.colors.outlineVariant,
              }]}
              placeholder={t('journal.tagsLabel')}
              placeholderTextColor={theme.colors.outline}
              value={tags}
              onChangeText={setTags}
            />

            <Button
              mode="contained"
              icon="check"
              onPress={handleSave}
              style={styles.saveBtn}
            >
              {t('journal.saveEntry')}
            </Button>

            <Button
              mode="text"
              onPress={() => router.back()}
              style={{ marginTop: 8 }}
            >
              {t('common.cancel')}
            </Button>
          </CustomCard>
        </Animated.View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 16 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5 },
  fieldLabel: { fontWeight: '600', marginBottom: 8, marginTop: 12 },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 180,
    lineHeight: 22,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  tagsInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  saveBtn: {
    marginTop: 20,
    borderRadius: 100,
    paddingVertical: 2,
  },
});