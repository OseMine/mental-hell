import { useWindowDimensions, Platform } from 'react-native';

const DESKTOP_BREAKPOINT = 1024;
export const CONTENT_MAX_WIDTH = 960;

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  return {
    isDesktop,
    contentMaxWidth: CONTENT_MAX_WIDTH,
    contentPadding: () => Math.max(0, (width - CONTENT_MAX_WIDTH) / 2),
    windowWidth: width,
  };
}
