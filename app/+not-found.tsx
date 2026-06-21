import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { Background } from '@/src/widgets/Background';
import { useTranslation } from '@/src/i18n/useTranslation';

export default function NotFoundScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: true }} />
      <Background scrollable={false}>
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>
            {t('notFound.title')}
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          >
            {t('notFound.description')}
          </Text>
          <Link href="/" asChild>
            <Button
              mode="contained"
              icon="home"
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {t('notFound.backToDashboard')}
            </Button>
          </Link>
        </View>
      </Background>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  button: {
    borderRadius: 100, // Material 3 Pill-Shape für Buttons
    width: '100%',
    maxWidth: 280,
  },
  buttonContent: {
    paddingVertical: 6, // Macht den Button etwas griffiger
  },
});