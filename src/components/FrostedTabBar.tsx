import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, View, Pressable, LayoutChangeEvent, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme, Text, MD3Theme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

interface TabConfig {
  name: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}

const TAB_CONFIGS: TabConfig[] = [
  { name: 'index', icon: 'home', label: 'Home' },
  { name: 'today', icon: 'heart-circle', label: 'Today' },
  { name: 'journal', icon: 'book', label: 'Journal' },
  { name: 'science', icon: 'flask', label: 'Science' },
  { name: 'analytics', icon: 'bar-chart', label: 'Analytics' },
  { name: 'settings', icon: 'settings', label: 'Settings' },
];

const TAB_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {};
const TAB_LABELS: Record<string, string> = {};
for (const tab of TAB_CONFIGS) {
  TAB_ICONS[tab.name] = tab.icon;
  TAB_LABELS[tab.name] = tab.label;
}

export function FrostedTabBar(props: BottomTabBarProps) {
  const theme = useTheme() as MD3Theme;
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const { state, navigation, descriptors } = props;
  const routes = state.routes;
  const activeIdx = state.index;

  const isDesktop = Platform.OS === 'web' && windowWidth >= 1024;

  React.useEffect(() => {
    const entry = tabLayouts[routes[activeIdx]?.key];
    if (entry) {
      indicatorX.value = withSpring(entry.x, { damping: 26, stiffness: 200, mass: 0.8 });
      indicatorW.value = withSpring(entry.width, { damping: 26, stiffness: 200, mass: 0.8 });
    }
  }, [activeIdx, tabLayouts]);

  React.useEffect(() => {
    if (Object.keys(tabLayouts).length === routes.length) {
      const entry = tabLayouts[routes[activeIdx]?.key];
      if (entry) {
        indicatorX.value = entry.x;
        indicatorW.value = entry.width;
      }
    }
  }, [tabLayouts]);

  const onTabLayout = useCallback((key: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [key]: { x, width } }));
  }, []);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  const isDark = theme.dark;

  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        <BlurView
          intensity={isDark ? 60 : 80}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? 'rgba(0,0,0,0.5)'
                : 'rgba(255,255,255,0.5)',
            },
          ]}
        />
        <View style={styles.desktopTabRow}>
          {routes.map((route, idx) => {
            const isActive = idx === activeIdx;
            const iconName = TAB_ICONS[route.name] ?? 'ellipse';
            const focusedOptions = descriptors[route.key]?.options;
            const label = focusedOptions?.tabBarLabel ?? focusedOptions?.title ?? TAB_LABELS[route.name] ?? route.name;

            const handlePress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={handlePress}
                onLayout={(e) => onTabLayout(route.key, e)}
                style={styles.desktopTab}
              >
                <View style={[
                  styles.desktopTabInner,
                  isActive && { backgroundColor: theme.colors.primaryContainer }
                ]}>
                  <Ionicons
                    name={iconName}
                    size={20}
                    color={
                      isActive
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurfaceVariant
                    }
                  />
                  <Text
                    variant="labelMedium"
                    style={{
                      color: isActive
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurfaceVariant,
                      fontWeight: isActive ? '700' : '500',
                      fontSize: 12,
                      marginLeft: 6,
                    }}
                    numberOfLines={1}
                  >
                    {label as string}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      <BlurView
        intensity={isDark ? 60 : 80}
        tint={isDark ? 'dark' : 'light'}
        style={[StyleSheet.absoluteFill, styles.blur]}
      />
      <View
        style={[
          styles.backgroundTint,
          {
            backgroundColor: isDark
              ? 'rgba(0,0,0,0.5)'
              : 'rgba(255,255,255,0.5)',
          },
        ]}
      />

      <View style={styles.tabRow}>
        <Animated.View
          style={[
            styles.indicator,
            {
              backgroundColor: theme.colors.primaryContainer,
              borderColor: theme.colors.outlineVariant,
            },
            indicatorStyle,
          ]}
        />

        {routes.map((route, idx) => {
          const isActive = idx === activeIdx;
          const iconName = TAB_ICONS[route.name] ?? 'ellipse';
          const focusedOptions = descriptors[route.key]?.options;
          const label = focusedOptions?.tabBarLabel ?? focusedOptions?.title ?? TAB_LABELS[route.name] ?? route.name;

          const handlePress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={handlePress}
              onLayout={(e) => onTabLayout(route.key, e)}
              style={styles.tab}
            >
              <View style={styles.tabInner}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={
                    isActive
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSurfaceVariant
                  }
                />
                <Text
                  variant="labelSmall"
                  style={{
                    color: isActive
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSurfaceVariant,
                    fontWeight: isActive ? '700' : '500',
                    fontSize: 10,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {label as string}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    flexDirection: 'row',
    paddingTop: 4,
    borderTopWidth: 0,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      },
    }),
  },
  blur: {
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(128,128,128,0.15)',
  },
  backgroundTint: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    borderRadius: 24,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    marginHorizontal: 4,
    paddingVertical: 4,
  },
  indicator: {
    position: 'absolute',
    top: 4,
    height: '100%',
    borderRadius: 20,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    zIndex: 1,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  desktopContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 100,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.12)',
    overflow: 'hidden',
  },
  desktopTabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  desktopTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopTabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
  },
});
