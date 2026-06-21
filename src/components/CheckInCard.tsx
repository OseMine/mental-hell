import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text, useTheme, Button, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInDown } from 'react-native-reanimated';
import { useHealthStore } from '@/src/store/healthStore';
import { CustomCard } from '@/src/widgets/CustomCard';
import { CompletedPill } from '@/src/widgets/CompletedPill';
import { SliderRow } from '@/src/components/SliderRow';
import { formatTime } from '@/src/utils/formatters';
import { useTranslation } from '@/src/i18n/useTranslation';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CheckInState {
  mood_score: number;
  stress_level: number;
  notes: string;
  opened_at: number | null;
}

interface CheckInMeta {
  type: 'morning' | 'midday' | 'evening';
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  scheduled_time: string;
}

interface CheckInCardProps {
  meta: CheckInMeta;
  data: CheckInState;
  isExpanded: boolean;
  onExpand: () => void;
  onDataChange: (data: CheckInState) => void;
  onSave: () => void;
  children?: React.ReactNode;
}

const springConfig = { damping: 26, stiffness: 200, mass: 0.8 };

export function CheckInCard({ meta, data, isExpanded, onExpand, onDataChange, onSave, children }: CheckInCardProps) {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { getDailyLogsByType } = useHealthStore();
  const completed = getDailyLogsByType(meta.type);
  const prevExpanded = useRef(isExpanded);

  const chevronRotation = useSharedValue(isExpanded ? 0 : 1);

  useEffect(() => {
    if (prevExpanded.current !== isExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      chevronRotation.value = withSpring(isExpanded ? 0 : 1, springConfig);
      prevExpanded.current = isExpanded;
    }
  }, [isExpanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value * 180}deg` }],
  }));

  return (
    <CustomCard style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => !completed && onExpand()}
        activeOpacity={completed ? 1 : 0.7}
      >
        <View style={styles.cardHeaderLeft}>
          <Ionicons name={meta.icon} size={24} color={theme.colors.primary} style={styles.icon} />
          <View>
            <Text variant="titleMedium" style={{ fontWeight: '700' }}>
              {meta.label}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              {t('today.scheduled', { time: meta.scheduled_time })}
            </Text>
          </View>
        </View>

        {completed ? (
          <View style={styles.statusRow}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {t('today.completed')}
            </Text>
          </View>
        ) : (
          <Animated.View style={[styles.statusRow, chevronStyle]}>
            <Ionicons
              name="chevron-down"
              size={18}
              color={theme.colors.outline}
            />
            <Text variant="labelMedium" style={{ color: theme.colors.outline, fontWeight: '600' }}>
              {isExpanded ? t('today.close') : t('today.open')}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      {completed && (
        <View style={[styles.completedRow, { borderTopColor: theme.colors.outlineVariant }]}>
          <CompletedPill label={t('checkIn.mood')} value={completed.mood_score} color={theme.colors.primary} />
          <CompletedPill label={t('checkIn.stress')} value={completed.stress_level} color={theme.colors.tertiary} />
          <View style={styles.completedMeta}>
            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
              {t('checkIn.start', { time: formatTime(completed.opened_at) })}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 2 }}>
              {t('checkIn.end', { time: formatTime(completed.saved_at) })}
            </Text>
          </View>
        </View>
      )}

      {isExpanded && !completed && (
        <Animated.View
          entering={FadeInDown.duration(400).springify().damping(22).stiffness(180)}
          style={[styles.form, { borderTopColor: theme.colors.outlineVariant }]}
        >
          {data.opened_at && (
            <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 12 }}>
              {t('checkIn.startedAt', { time: formatTime(data.opened_at) })}
            </Text>
          )}

          <SliderRow
            label={t('checkIn.moodLabel')}
            value={data.mood_score}
            color={theme.colors.primary}
            trackColor={theme.colors.surfaceVariant}
            onChange={(v) => onDataChange({ ...data, mood_score: v })}
          />

          <SliderRow
            label={t('checkIn.stressLabel')}
            value={data.stress_level}
            color={theme.colors.tertiary}
            trackColor={theme.colors.surfaceVariant}
            onChange={(v) => onDataChange({ ...data, stress_level: v })}
          />

          <Text variant="labelLarge" style={styles.fieldLabel}>
            {t('checkIn.notesLabel')}
          </Text>
          <TextInput
            style={[styles.notesInput, {
              backgroundColor: theme.colors.surfaceVariant,
              color: theme.colors.onSurface,
              borderColor: theme.colors.outlineVariant,
            }]}
            placeholder={t('checkIn.notesPlaceholder')}
            placeholderTextColor={theme.colors.outline}
            multiline
            numberOfLines={3}
            value={data.notes}
            onChangeText={(t) => onDataChange({ ...data, notes: t })}
          />

          {children}

          <Button
            mode="contained"
            icon="check"
            onPress={onSave}
            style={styles.saveBtn}
          >
            {t('checkIn.saveEntry')}
          </Button>
        </Animated.View>
      )}
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  cardContainer: { padding: 0, overflow: 'hidden' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { marginRight: 14 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  completedMeta: { marginLeft: 'auto' },
  form: { paddingHorizontal: 16, paddingVertical: 18, borderTopWidth: 1 },
  fieldLabel: { fontWeight: '600', marginBottom: 8, marginTop: 4 },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: 18,
    borderRadius: 100,
    paddingVertical: 2,
  },
});
