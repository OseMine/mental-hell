import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

interface InfoBoxProps {
  text: string;
}

export function InfoBox({ text }: InfoBoxProps) {
  const theme = useTheme();

  return (
    <View style={[styles.infoBox, { backgroundColor: theme.colors.secondaryContainer }]}>
      <Ionicons name="information-circle" size={22} color={theme.colors.onSecondaryContainer} />
      <Text variant="bodySmall" style={[styles.infoText, { color: theme.colors.onSecondaryContainer }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    gap: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
});