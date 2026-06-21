import React, { useEffect } from 'react';
import { Text, MD3Theme } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface AnimatedScoreProps {
  score: number | null;
  color: string;
  theme: MD3Theme;
}

const springConfig = { damping: 28, stiffness: 200, mass: 0.8 };

export function AnimatedScore({ score, color }: AnimatedScoreProps) {
  const scale = useSharedValue(0);
  const displayScore = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, springConfig);
  }, []);

  useEffect(() => {
    displayScore.value = withSpring(score ?? 0, { ...springConfig, stiffness: 50 });
    scale.value = withSpring(1.08, { ...springConfig, stiffness: 180 });
    scale.value = withSpring(1, { ...springConfig, stiffness: 100 });
  }, [score]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text variant="displayLarge" style={{ color, fontWeight: '800', lineHeight: 68 }}>
        {score !== null ? score.toFixed(1) : '–'}
      </Text>
    </Animated.View>
  );
}
