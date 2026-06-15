import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  iconColor: string;
}

export function StatCard({ icon, label, value, iconColor }: StatCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.onSurfaceVariant }]}>
        {value}
      </Text>
      <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontWeight: '700',
  },
});