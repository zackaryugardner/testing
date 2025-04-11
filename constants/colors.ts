// App color scheme
export const colors = {
  primary: "#5B8AF9",
  primaryLight: "#E8EFFF",
  secondary: "#65D6AD",
  secondaryLight: "#E6F7F1",
  background: "#FFFFFF",
  card: "#FFFFFF",
  text: "#1A1A2E",
  textLight: "#6E7191",
  textExtraLight: "#A0A3BD",
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#FF5252",
  border: "#EAEAEF",
  borderLight: "#F7F7FC",
  overlay: "rgba(26, 26, 46, 0.5)",
};

// Habit category colors
export const categoryColors = {
  health: "#5B8AF9",
  fitness: "#65D6AD",
  productivity: "#FFAA5B",
  mindfulness: "#B79CFF",
  learning: "#FF8FA3",
  finance: "#4CAF50",
  social: "#FF5252",
  other: "#A0A3BD",
};

export default {
  light: {
    text: colors.text,
    background: colors.background,
    tint: colors.primary,
    tabIconDefault: colors.textExtraLight,
    tabIconSelected: colors.primary,
  },
};