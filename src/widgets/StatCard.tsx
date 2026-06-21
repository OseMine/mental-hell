import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';

interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  iconColor: string;
}

const springConfig = { damping: 12, stiffness: 200, mass: 0.5 };

export function StatCard({ icon, label, value, iconColor }: StatCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, springConfig);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, springConfig);
  }, []);

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ flex: 1 }}>
      <Animated.View style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }, animatedStyle]}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.onSurfaceVariant }]}>
          {value}
        </Text>
        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
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