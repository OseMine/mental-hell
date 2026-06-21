import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface StaggeredEntranceProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
}

export function StaggeredEntrance({ children, index = 0, delay = 80 }: StaggeredEntranceProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(index * delay).springify().damping(22).stiffness(180)}
    >
      {children}
    </Animated.View>
  );
}
