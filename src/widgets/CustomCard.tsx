// src/widgets/CustomCard.tsx
import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';
interface CustomCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function CustomCard({ children, style }: CustomCardProps) {
  const theme = useAppTheme();

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: theme.colors.surfaceVariant, // Echtes M3 Oberflächen-Grau/Weiß
        borderColor: theme.colors.legacyBorder,
      }, 
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
});