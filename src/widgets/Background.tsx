// src/widgets/Background.tsx
import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/useAppTheme';
import { useResponsive, CONTENT_MAX_WIDTH } from '../utils/responsive';

interface BackgroundProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function Background({ children, scrollable = true, style }: BackgroundProps) {
  const theme = useAppTheme();
  const { isDesktop } = useResponsive();

  const combinedStyle = [
    styles.container, 
    { backgroundColor: theme.colors.background }, 
    style
  ];

  const renderContent = () => {
    if (!isDesktop) return children;
    const innerStyle: ViewStyle = {
      width: '100%',
      maxWidth: CONTENT_MAX_WIDTH,
      alignSelf: 'center',
    };
    if (!scrollable) innerStyle.flex = 1;
    return <View style={innerStyle}>{children}</View>;
  };

  return (
    <SafeAreaView style={combinedStyle} edges={['bottom', 'left', 'right']}>
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      ) : (
        <View style={styles.fixedContent}>
          {renderContent()}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  fixedContent: { flex: 1, padding: 16 },
});