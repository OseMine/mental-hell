import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text, Divider, useTheme } from 'react-native-paper';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { useTranslation } from '@/src/i18n/useTranslation';

export default function ModalScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Background scrollable={false}>
      <View style={styles.container}>
        <CustomCard style={styles.cardLayout}>
          <Text variant="headlineSmall" style={styles.title}>
            {t('modal.title')}
          </Text>

          <Divider style={styles.separator} />

          <Text
            variant="bodyMedium"
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('modal.description')}
          </Text>
        </CustomCard>

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLayout: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 20,
    width: '100%',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
});