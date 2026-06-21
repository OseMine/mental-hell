import React, { useState, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme, Button, Searchbar, MD3Theme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHealthStore, JournalEntry } from '@/src/store/healthStore';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { TabPageTransition } from '@/src/components/TabPageTransition';
import { useTranslation } from '@/src/i18n/useTranslation';
import { formatTime, getDateFormatted } from '@/src/utils/formatters';
import { router } from 'expo-router';
import { useResponsive } from '@/src/utils/responsive';

const MOOD_EMOJIS: Record<string, string> = {
  '1': '😞', '2': '😔', '3': '😐', '4': '🙂', '5': '😊',
  '6': '😌', '7': '😄', '8': '🤗', '9': '🥰', '10': '🤩',
};

export default function JournalScreen() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();
  const { journalEntries, deleteJournalEntry } = useHealthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return journalEntries;
    const q = searchQuery.toLowerCase();
    return journalEntries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [journalEntries, searchQuery]);

  const handleDelete = (entry: JournalEntry) => {
    Alert.alert(t('journal.deleteEntry'), t('journal.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteJournalEntry(entry.id);
        },
      },
    ]);
  };

  const handleNewEntry = () => {
    router.push('/screens/journal-editor');
  };

  const handleEditEntry = (entry: JournalEntry) => {
    router.push(`/screens/journal-editor?id=${entry.id}`);
  };

  const handleViewEntry = (entry: JournalEntry) => {
    router.push(`/screens/journal-view?id=${entry.id}`);
  };

  return (
    <Background scrollable={false}>
      <TabPageTransition>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
            {t('journal.title')}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
            {t('journal.subtitle')}
          </Text>
        </View>

        <Searchbar
          placeholder={t('journal.search')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
          inputStyle={{ color: theme.colors.onSurface, fontSize: 14 }}
          iconColor={theme.colors.outline}
          placeholderTextColor={theme.colors.outline}
        />

        <Button
          mode="contained"
          icon="pencil"
          onPress={handleNewEntry}
          style={styles.newEntryBtn}
          contentStyle={styles.newEntryContent}
        >
          {t('journal.newEntry')}
        </Button>

        {filteredEntries.length === 0 ? (
          <CustomCard glass>
            <Text variant="bodyLarge" style={[styles.emptyText, { color: theme.colors.outline }]}>
              {t('journal.noEntries')}
            </Text>
          </CustomCard>
        ) : isDesktop ? (
          <View style={styles.desktopGrid}>
            {filteredEntries.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.duration(400).delay(index * 60).springify().damping(22).stiffness(180)}
                style={styles.desktopGridItem}
              >
                <TouchableOpacity onPress={() => handleViewEntry(item)} onLongPress={() => handleEditEntry(item)}>
                  <CustomCard glass style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <Text variant="titleMedium" style={[styles.entryTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <TouchableOpacity onPress={() => handleDelete(item)}>
                        <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                      </TouchableOpacity>
                    </View>
                    <Text variant="bodyMedium" style={[styles.entryPreview, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                      {item.content}
                    </Text>
                    <View style={styles.entryFooter}>
                      <View style={styles.entryMeta}>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                          {getDateFormatted(new Date(item.created_at))}
                        </Text>
                        {item.tags.length > 0 && (
                          <Text variant="labelSmall" style={{ color: theme.colors.primary, marginLeft: 8 }}>
                            {item.tags.join(', ')}
                          </Text>
                        )}
                      </View>
                      <Text variant="titleLarge" style={{ fontSize: 20 }}>
                        {MOOD_EMOJIS[String(Math.round(item.mood_score))] || '😐'}
                      </Text>
                    </View>
                  </CustomCard>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        ) : (
          <FlatList
            data={filteredEntries}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.duration(400).delay(index * 60).springify().damping(22).stiffness(180)}
              >
                <TouchableOpacity onPress={() => handleViewEntry(item)} onLongPress={() => handleEditEntry(item)}>
                  <CustomCard glass style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <Text variant="titleMedium" style={[styles.entryTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <TouchableOpacity onPress={() => handleDelete(item)}>
                        <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                      </TouchableOpacity>
                    </View>
                    <Text variant="bodyMedium" style={[styles.entryPreview, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                      {item.content}
                    </Text>
                    <View style={styles.entryFooter}>
                      <View style={styles.entryMeta}>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                          {getDateFormatted(new Date(item.created_at))}
                        </Text>
                        {item.tags.length > 0 && (
                          <Text variant="labelSmall" style={{ color: theme.colors.primary, marginLeft: 8 }}>
                            {item.tags.join(', ')}
                          </Text>
                        )}
                      </View>
                      <Text variant="titleLarge" style={{ fontSize: 20 }}>
                        {MOOD_EMOJIS[String(Math.round(item.mood_score))] || '😐'}
                      </Text>
                    </View>
                  </CustomCard>
                </TouchableOpacity>
              </Animated.View>
            )}
          />
        )}
      </TabPageTransition>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 12 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5 },
  searchBar: { marginBottom: 12, borderRadius: 12, height: 44 },
  newEntryBtn: { marginBottom: 16, borderRadius: 100 },
  newEntryContent: { paddingVertical: 4 },
  emptyText: { textAlign: 'center', paddingVertical: 32 },
  list: { paddingBottom: 24 },
  entryCard: { padding: 14 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  entryTitle: { fontWeight: '700', flex: 1, marginRight: 8 },
  entryPreview: { lineHeight: 20, marginBottom: 10 },
  entryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryMeta: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  desktopGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: -6 },
  desktopGridItem: { width: '50%', padding: 6 },
});