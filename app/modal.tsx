import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text, Divider, useTheme } from 'react-native-paper';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';

export default function ModalScreen() {
  const theme = useTheme();

  return (
    <Background scrollable={false}>
      <View style={styles.container}>
        <CustomCard style={styles.cardLayout}>
          <Text variant="headlineSmall" style={styles.title}>
            Info-Modal
          </Text>
          
          <Divider style={styles.separator} />
          
          <Text 
            variant="bodyMedium" 
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          >
            Hier kannst du künftig wichtige Schnelleinstellungen, Erklärungen für deine 
            Mental-Health-Metriken oder zusätzliche Statistiken anzeigen lassen.
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