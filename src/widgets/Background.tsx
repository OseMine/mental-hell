// src/widgets/Background.tsx
import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/useAppTheme';

interface BackgroundProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function Background({ children, scrollable = true, style }: BackgroundProps) {
  const theme = useAppTheme();
  
  const combinedStyle = [
    styles.container, 
    { backgroundColor: theme.colors.background }, 
    style
  ];

  return (
    <SafeAreaView style={combinedStyle} edges={['bottom', 'left', 'right']}>
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={styles.fixedContent}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  fixedContent: { flex: 1, padding: 16 },
});