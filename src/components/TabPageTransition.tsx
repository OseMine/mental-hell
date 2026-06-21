import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

interface TabPageTransitionProps {
  children: React.ReactNode;
}

const EASE_OUT = Easing.bezier(0.25, 0.1, 0.25, 1);
const EASE_IN = Easing.bezier(0.4, 0, 0.6, 1);

export function TabPageTransition({ children }: TabPageTransitionProps) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    if (isFocused) {
      opacity.value = withTiming(1, { duration: 250, easing: EASE_OUT });
      translateY.value = withTiming(0, { duration: 300, easing: EASE_OUT });
    } else {
      opacity.value = withTiming(0, { duration: 150, easing: EASE_IN });
      translateY.value = withTiming(-6, { duration: 200, easing: EASE_IN });
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
