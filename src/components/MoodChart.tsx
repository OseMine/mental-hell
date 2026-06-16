import React from "react";
import { View, Text as RNText } from "react-native"; 
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg"; 
import { DailyLog } from "../store/healthStore";

interface MoodChartProps {
  logs: DailyLog[];
  width?: number;
  height?: number;
}

export const MoodChart: React.FC<MoodChartProps> = ({
  logs,
  width = 320,
  height = 240,
}) => {
  if (logs.length === 0) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: 10,
        }}
      >
        <RNText style={{ fontSize: 14, color: "#999999" }}>
          Keine Daten verfügbar
        </RNText>
      </View>
    );
  }

  // Filter logs with mood_score, get one per day
  const logsPerDay: Map<string, DailyLog[]> = new Map();
  logs.forEach((log) => {
    // Sicheres Auslesen des Datumsfeldes per Type-Cast Fallback Chain
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

  // Get average mood score per day (latest 7 days)
  const dailyAverages = Array.from(logsPerDay.entries())
    .slice(-7)
    .map(([date, dayLogs]) => {
      const avgMood =
        dayLogs.reduce((sum, log) => sum + log.mood_score, 0) / dayLogs.length;
      return {
        date,
        mood: avgMood,
      };
    });

  if (dailyAverages.length === 0) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: 10,
        }}
      >
        <RNText style={{ fontSize: 14, color: "#999999" }}>
          Keine Daten verfügbar
        </RNText>
      </View>
    );
  }

  // Chart dimensions
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale the mood scores to chart coordinates
  const minMood = 1;
  const maxMood = 10;
  const xStep = chartWidth / Math.max(dailyAverages.length - 1, 1);

  // Convert mood score to Y coordinate
  const moodToY = (mood: number) => {
    return chartHeight - ((mood - minMood) / (maxMood - minMood)) * chartHeight;
  };

  // Generate polyline points for the mood curve
  const polylinePoints = dailyAverages
    .map((item, index) => {
      const x = padding.left + index * xStep;
      const y = padding.top + moodToY(item.mood);
      return `${x},${y}`;
    })
    .join(" ");

  // Generate day labels (abbreviated)
  const dayLabels = dailyAverages.map((item) => {
    const date = new Date(item.date);
    const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    return days[date.getDay()];
  });

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Svg width={width} height={height}>
        {/* Y-axis */}
        <Line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#DDDDDD"
          strokeWidth="1"
        />

        {/* X-axis */}
        <Line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#DDDDDD"
          strokeWidth="1"
        />

        {/* Y-axis labels mit SvgText */}
        <SvgText
          x={padding.left - 8}
          y={padding.top + 5}
          fontSize="10"
          fill="#999999"
          textAnchor="end"
        >
          10
        </SvgText>
        <SvgText
          x={padding.left - 8}
          y={padding.top + chartHeight / 2 + 5}
          fontSize="10"
          fill="#999999"
          textAnchor="end"
        >
          5
        </SvgText>
        <SvgText
          x={padding.left - 8}
          y={height - padding.bottom + 5}
          fontSize="10"
          fill="#999999"
          textAnchor="end"
        >
          1
        </SvgText>

        {/* Grid lines */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => {
          const y = padding.top + moodToY(val);
          return (
            <Line
              key={`grid-${val}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Mood line */}
        <Polyline
          points={polylinePoints}
          stroke="#2E86DE"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Data points */}
        {dailyAverages.map((item, index) => {
          const x = padding.left + index * xStep;
          const y = padding.top + moodToY(item.mood);
          return (
            <Circle key={`point-${index}`} cx={x} cy={y} r="4" fill="#2E86DE" />
          );
        })}

        {/* X-axis labels (day names) mit SvgText */}
        {dayLabels.map((label, index) => {
          const x = padding.left + index * xStep;
          const y = height - padding.bottom + 20;
          return (
            <SvgText
              key={`label-${index}`}
              x={x}
              y={y}
              fontSize="10"
              fill="#666666"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};