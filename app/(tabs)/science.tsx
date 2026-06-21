import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { TabPageTransition } from '@/src/components/TabPageTransition';
import { useTranslation } from '@/src/i18n/useTranslation';
import { useResponsive } from '@/src/utils/responsive';

const SECTION_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  methodology: 'flask',
  ema: 'pulse',
  wqa: 'document-text',
  score: 'calculator',
  clinical: 'medkit',
};

export default function ScienceScreen() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  return (
    <Background scrollable={true}>
      <TabPageTransition>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text variant="headlineLarge" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
              {t('science.title')}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
              {t('science.subtitle')}
            </Text>
          </View>

          {isDesktop ? (
            <>
              <Animated.View entering={FadeInDown.duration(400).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.sectionHeader}>
                    <Ionicons name={SECTION_ICONS.methodology} size={22} color={theme.colors.primary} />
                    <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                      {t('science.methodology')}
                    </Text>
                  </View>
                </CustomCard>
              </Animated.View>

              <View style={styles.desktopRow}>
                <View style={{ flex: 1 }}>
                  <Animated.View entering={FadeInDown.duration(400).delay(80).springify().damping(22).stiffness(180)}>
                    <CustomCard glass>
                      <View style={styles.cardRow}>
                        <Ionicons name={SECTION_ICONS.ema} size={28} color={theme.colors.primary} style={styles.cardIcon} />
                        <View style={styles.cardContent}>
                          <Text variant="titleSmall" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                            {t('science.emaTitle')}
                          </Text>
                          <Text variant="bodyMedium" style={[styles.cardDesc, { color: theme.colors.onSurfaceVariant }]}>
                            {t('science.emaDesc')}
                          </Text>
                        </View>
                      </View>
                    </CustomCard>
                  </Animated.View>
                </View>
                <View style={{ flex: 1 }}>
                  <Animated.View entering={FadeInDown.duration(400).delay(160).springify().damping(22).stiffness(180)}>
                    <CustomCard glass>
                      <View style={styles.cardRow}>
                        <Ionicons name={SECTION_ICONS.wqa} size={28} color={theme.colors.tertiary} style={styles.cardIcon} />
                        <View style={styles.cardContent}>
                          <Text variant="titleSmall" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                            {t('science.wqaTitle')}
                          </Text>
                          <Text variant="bodyMedium" style={[styles.cardDesc, { color: theme.colors.onSurfaceVariant }]}>
                            {t('science.wqaDesc')}
                          </Text>
                        </View>
                      </View>
                    </CustomCard>
                  </Animated.View>
                </View>
              </View>

              <View style={styles.desktopRow}>
                <View style={{ flex: 1 }}>
                  <Animated.View entering={FadeInDown.duration(400).delay(240).springify().damping(22).stiffness(180)}>
                    <CustomCard glass>
                      <View style={styles.cardRow}>
                        <Ionicons name={SECTION_ICONS.score} size={28} color={theme.colors.primary} style={styles.cardIcon} />
                        <View style={styles.cardContent}>
                          <Text variant="titleSmall" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                            {t('science.scoreTitle')}
                          </Text>
                          <Text variant="bodyMedium" style={[styles.cardDesc, { color: theme.colors.onSurfaceVariant }]}>
                            {t('science.scoreDesc')}
                          </Text>
                        </View>
                      </View>
                    </CustomCard>
                  </Animated.View>
                </View>
                <View style={{ flex: 1 }} />
              </View>

              <Animated.View entering={FadeInDown.duration(400).delay(320).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.sectionHeader}>
                    <Ionicons name={SECTION_ICONS.clinical} size={22} color={theme.colors.tertiary} />
                    <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                      {t('science.clinicalContext')}
                    </Text>
                  </View>
                </CustomCard>
              </Animated.View>

              <View style={styles.desktopRow}>
                <View style={{ flex: 1 }}>
                  <Animated.View entering={FadeInDown.duration(400).delay(400).springify().damping(22).stiffness(180)}>
                    <CustomCard glass>
                      <View style={styles.clinicalRow}>
                        <View style={[styles.clinicalBadge, { backgroundColor: theme.colors.errorContainer }]}>
                          <Text variant="labelLarge" style={{ color: theme.colors.error, fontWeight: '700' }}>PHQ-9</Text>
                        </View>
                        <Text variant="bodyMedium" style={[styles.clinicalText, { color: theme.colors.onSurfaceVariant }]}>
                          {t('science.phq9Info')}
                        </Text>
                      </View>
                    </CustomCard>
                  </Animated.View>
                </View>
                <View style={{ flex: 1 }}>
                  <Animated.View entering={FadeInDown.duration(400).delay(480).springify().damping(22).stiffness(180)}>
                    <CustomCard glass>
                      <View style={styles.clinicalRow}>
                        <View style={[styles.clinicalBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                          <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>GAD-7</Text>
                        </View>
                        <Text variant="bodyMedium" style={[styles.clinicalText, { color: theme.colors.onSurfaceVariant }]}>
                          {t('science.gad7Info')}
                        </Text>
                      </View>
                    </CustomCard>
                  </Animated.View>
                </View>
              </View>

              <View style={styles.desktopRow}>
                <View style={{ flex: 1 }}>
                  <Animated.View entering={FadeInDown.duration(400).delay(560).springify().damping(22).stiffness(180)}>
                    <CustomCard glass>
                      <View style={styles.citationBox}>
                        <Ionicons name="book-outline" size={18} color={theme.colors.outline} />
                        <Text variant="bodySmall" style={{ color: theme.colors.outline, marginLeft: 8, flex: 1, fontStyle: 'italic' }}>
                          {t('science.citationLabel')}
                        </Text>
                      </View>
                    </CustomCard>
                  </Animated.View>
                </View>
                <View style={{ flex: 1 }}>
                  <CustomCard style={[styles.disclaimerCard, { backgroundColor: theme.colors.errorContainer + '40', marginTop: 0 }]}>
                    <Text variant="bodySmall" style={{ color: theme.colors.error, textAlign: 'center' }}>
                      {t('science.disclaimer')}
                    </Text>
                  </CustomCard>
                </View>
              </View>
            </>
          ) : (
            <>
              <Animated.View entering={FadeInDown.duration(400).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.sectionHeader}>
                    <Ionicons name={SECTION_ICONS.methodology} size={22} color={theme.colors.primary} />
                    <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                      {t('science.methodology')}
                    </Text>
                  </View>
                </CustomCard>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(400).delay(80).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.cardRow}>
                    <Ionicons name={SECTION_ICONS.ema} size={28} color={theme.colors.primary} style={styles.cardIcon} />
                    <View style={styles.cardContent}>
                      <Text variant="titleSmall" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                        {t('science.emaTitle')}
                      </Text>
                      <Text variant="bodyMedium" style={[styles.cardDesc, { color: theme.colors.onSurfaceVariant }]}>
                        {t('science.emaDesc')}
                      </Text>
                    </View>
                  </View>
                </CustomCard>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(400).delay(160).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.cardRow}>
                    <Ionicons name={SECTION_ICONS.wqa} size={28} color={theme.colors.tertiary} style={styles.cardIcon} />
                    <View style={styles.cardContent}>
                      <Text variant="titleSmall" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                        {t('science.wqaTitle')}
                      </Text>
                      <Text variant="bodyMedium" style={[styles.cardDesc, { color: theme.colors.onSurfaceVariant }]}>
                        {t('science.wqaDesc')}
                      </Text>
                    </View>
                  </View>
                </CustomCard>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(400).delay(240).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.cardRow}>
                    <Ionicons name={SECTION_ICONS.score} size={28} color={theme.colors.primary} style={styles.cardIcon} />
                    <View style={styles.cardContent}>
                      <Text variant="titleSmall" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                        {t('science.scoreTitle')}
                      </Text>
                      <Text variant="bodyMedium" style={[styles.cardDesc, { color: theme.colors.onSurfaceVariant }]}>
                        {t('science.scoreDesc')}
                      </Text>
                    </View>
                  </View>
                </CustomCard>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(400).delay(320).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.sectionHeader}>
                    <Ionicons name={SECTION_ICONS.clinical} size={22} color={theme.colors.tertiary} />
                    <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                      {t('science.clinicalContext')}
                    </Text>
                  </View>
                </CustomCard>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(400).delay(400).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.clinicalRow}>
                    <View style={[styles.clinicalBadge, { backgroundColor: theme.colors.errorContainer }]}>
                      <Text variant="labelLarge" style={{ color: theme.colors.error, fontWeight: '700' }}>PHQ-9</Text>
                    </View>
                    <Text variant="bodyMedium" style={[styles.clinicalText, { color: theme.colors.onSurfaceVariant }]}>
                      {t('science.phq9Info')}
                    </Text>
                  </View>
                </CustomCard>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(400).delay(480).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.clinicalRow}>
                    <View style={[styles.clinicalBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                      <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>GAD-7</Text>
                    </View>
                    <Text variant="bodyMedium" style={[styles.clinicalText, { color: theme.colors.onSurfaceVariant }]}>
                      {t('science.gad7Info')}
                    </Text>
                  </View>
                </CustomCard>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(400).delay(560).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <View style={styles.citationBox}>
                    <Ionicons name="book-outline" size={18} color={theme.colors.outline} />
                    <Text variant="bodySmall" style={{ color: theme.colors.outline, marginLeft: 8, flex: 1, fontStyle: 'italic' }}>
                      {t('science.citationLabel')}
                    </Text>
                  </View>
                </CustomCard>
              </Animated.View>

              <CustomCard style={[styles.disclaimerCard, { backgroundColor: theme.colors.errorContainer + '40' }]}>
                <Text variant="bodySmall" style={{ color: theme.colors.error, textAlign: 'center' }}>
                  {t('science.disclaimer')}
                </Text>
              </CustomCard>
            </>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </TabPageTransition>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 16 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5, marginBottom: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { fontWeight: '700' },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardIcon: { marginRight: 14, marginTop: 2 },
  cardContent: { flex: 1 },
  cardTitle: { fontWeight: '600', marginBottom: 6 },
  cardDesc: { lineHeight: 20 },
  clinicalRow: { flexDirection: 'row', alignItems: 'center' },
  clinicalBadge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginRight: 12 },
  clinicalText: { flex: 1, lineHeight: 20 },
  citationBox: { flexDirection: 'row', alignItems: 'center' },
  disclaimerCard: { marginTop: 16, borderRadius: 12, padding: 16 },
  desktopRow: { flexDirection: 'row', gap: 16, marginBottom: 0 },
});