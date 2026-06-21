import React from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Polyline, Text as SvgText, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { useTheme, MD3Theme } from "react-native-paper";
import { DailyLog } from "../store/healthStore";

interface MoodChartProps {
  logs: DailyLog[];
  width?: number;
  height?: number;
}

export const MoodChart: React.FC<MoodChartProps> = ({
  logs,
  width = 340,
  height = 220,
}) => {
  const theme = useTheme() as MD3Theme;

  if (logs.length === 0) {
    return (
      <View
        style={{
          width,
          height: height - 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SvgText
          x={width / 2}
          y={(height - 40) / 2}
          fontSize="12"
          fill={theme.colors.outline}
          textAnchor="middle"
        >
          No data
        </SvgText>
      </View>
    );
  }

  const logsPerDay: Map<string, DailyLog[]> = new Map();
  logs.forEach((log) => {
    const rawDate =
      (log as any).date ||
      (log as any).timestamp ||
      (log as any).createdAt ||
      new Date().toDateString();
    const dateKey = new Date(rawDate).toDateString();
    if (!logsPerDay.has(dateKey)) {
      logsPerDay.set(dateKey, []);
    }
    logsPerDay.get(dateKey)!.push(log);
  });

  const dailyAverages = Array.from(logsPerDay.entries())
    .slice(-7)
    .map(([date, dayLogs]) => {
      const avgMood =
        dayLogs.reduce((sum, log) => sum + log.mood_score, 0) / dayLogs.length;
      return { date, mood: avgMood };
    });

  if (dailyAverages.length === 0) {
    return (
      <View style={{ width, height: height - 40, justifyContent: "center", alignItems: "center" }}>
        <SvgText x={width / 2} y={(height - 40) / 2} fontSize="12" fill={theme.colors.outline} textAnchor="middle">
          No data
        </SvgText>
      </View>
    );
  }

  const padding = { top: 20, right: 16, bottom: 36, left: 36 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const minMood = 1;
  const maxMood = 10;
  const xStep = chartWidth / Math.max(dailyAverages.length - 1, 1);

  const moodToY = (mood: number) =>
    chartHeight - ((mood - minMood) / (maxMood - minMood)) * chartHeight;

  const polylinePoints = dailyAverages
    .map((item, index) => {
      const x = padding.left + index * xStep;
      const y = padding.top + moodToY(item.mood);
      return `${x},${y}`;
    })
    .join(" ");

  const dayLabels = dailyAverages.map((item) => {
    const date = new Date(item.date);
    const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    return days[date.getDay()];
  });

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.colors.primary} stopOpacity="0.15" />
            <Stop offset="1" stopColor={theme.colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {[2, 4, 6, 8, 10].map((val) => {
          const y = padding.top + moodToY(val);
          return (
            <Line
              key={`grid-${val}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke={theme.colors.outlineVariant}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          );
        })}

        {/* Y-axis labels */}
        {[2, 4, 6, 8, 10].map((val) => (
          <SvgText
            key={`yl-${val}`}
            x={padding.left - 8}
            y={padding.top + moodToY(val) + 4}
            fontSize="9"
            fill={theme.colors.outline}
            textAnchor="end"
          >
            {val}
          </SvgText>
        ))}

        {/* Area fill under line */}
        <Polyline
          points={`${polylinePoints} ${padding.left + (dailyAverages.length - 1) * xStep},${padding.top + chartHeight} ${padding.left},${padding.top + chartHeight}`}
          fill="url(#moodGrad)"
          stroke="none"
        />

        {/* Mood line */}
        <Polyline
          points={polylinePoints}
          stroke={theme.colors.primary}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dailyAverages.map((item, index) => {
          const x = padding.left + index * xStep;
          const y = padding.top + moodToY(item.mood);
          return (
            <React.Fragment key={`point-${index}`}>
              <Circle cx={x} cy={y} r="5" fill={theme.colors.surface} stroke={theme.colors.primary} strokeWidth="2" />
              <Circle cx={x} cy={y} r="2.5" fill={theme.colors.primary} />
            </React.Fragment>
          );
        })}

        {/* X-axis labels */}
        {dayLabels.map((label, index) => {
          const x = padding.left + index * xStep;
          const y = height - padding.bottom + 16;
          return (
            <SvgText
              key={`label-${index}`}
              x={x}
              y={y}
              fontSize="10"
              fill={theme.colors.outline}
              textAnchor="middle"
              fontWeight="600"
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};