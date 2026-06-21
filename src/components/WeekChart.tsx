import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { DailyLog } from '@/src/store/healthStore';
import { useChartData } from '@/src/store/useMentalScore';

const CHART_HEIGHT = 100;
const springConfig = { damping: 24, stiffness: 160, mass: 0.9 };

interface AnimatedBarProps {
  height: number;
  color: string;
  delay: number;
}

function AnimatedBar({ height, color, delay }: AnimatedBarProps) {
  const barHeight = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      barHeight.value = withSpring(height, springConfig);
    }, delay);
  }, [height, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: barHeight.value,
  }));

  return (
    <Animated.View
      style={[
        styles.chartBarFill,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

interface WeekChartProps {
  sevenDayLogs: DailyLog[];
}

export function WeekChart({ sevenDayLogs }: WeekChartProps) {
  const theme = useTheme() as MD3Theme;
  const chartData = useChartData(sevenDayLogs);

  return (
    <View style={styles.chart}>
      {chartData.map((d, i) => {
        const barH = d.avg !== null ? (d.avg / 10) * CHART_HEIGHT : 0;
        return (
          <View key={i} style={styles.chartCol}>
            <View style={[styles.chartBarBg, { height: CHART_HEIGHT, backgroundColor: theme.colors.surfaceVariant }]}>
              {d.avg !== null ? (
                <AnimatedBar
                  height={barH}
                  color={d.isToday ? theme.colors.primary : theme.colors.primary + '66'}
                  delay={i * 80}
                />
              ) : (
                <View style={[styles.chartEmpty, { borderColor: theme.colors.outlineVariant }]} />
              )}
            </View>
            {d.avg !== null && (
              <Text style={styles.chartVal}>{d.avg.toFixed(1)}</Text>
            )}
            <Text
              style={[styles.chartLabel, { color: d.isToday ? theme.colors.primary : theme.colors.outline }]}
            >
              {d.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 8 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBarBg: { justifyContent: 'flex-end', width: '50%', borderRadius: 8, overflow: 'hidden' },
  chartBarFill: { borderRadius: 8 },
  chartEmpty: { flex: 1, borderWidth: 1, borderStyle: 'dashed', borderRadius: 8 },
  chartVal: { marginTop: 4, fontWeight: '700', fontSize: 12 },
  chartLabel: { marginTop: 4, fontWeight: '600', fontSize: 12 },
});
