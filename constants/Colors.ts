const tintColorLight = "#2E86DE";
const tintColorDark = "#fff";

// iOS System Colors
const iOS_BACKGROUND = "#F2F2F7";
const iOS_CARD = "#FFFFFF";
const iOS_BLUE = "#2E86DE";
const iOS_GREEN = "#34C759";
const iOS_RED = "#FF3B30";
const iOS_ORANGE = "#FF9500";
const iOS_GRAY = "#999999";
const iOS_LIGHT_GRAY = "#E5E5EA";

export default {
  light: {
    text: "#000",
    background: iOS_BACKGROUND,
    tint: iOS_BLUE,
    tabIconDefault: "#ccc",
    tabIconSelected: iOS_BLUE,
    card: iOS_CARD,
    blue: iOS_BLUE,
    green: iOS_GREEN,
    red: iOS_RED,
    orange: iOS_ORANGE,
    gray: iOS_GRAY,
    lightGray: iOS_LIGHT_GRAY,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    card: iOS_CARD,
    blue: iOS_BLUE,
    green: iOS_GREEN,
    red: iOS_RED,
    orange: iOS_ORANGE,
    gray: iOS_GRAY,
    lightGray: iOS_LIGHT_GRAY,
  },
};
