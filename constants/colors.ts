// constants/Colors.ts

export type ThemeName = "light" | "dark";

export type Tokens = {
  background: string;
  text: string;
  muted: string;
  primary: string;
  primaryHover: string;
  success: string;
  warning: string;
  progress: string;
  iconCoin: string;
  iconGem: string;
  navActive: string;
  backgroundGradientStart: string;
  backgroundGradientEnd: string;
  tabBarBackground: string;
  tabBarInactive: string;
  error: string;
  badgeActive: string;
  accent: string;
  cardBackground: string;
  secretBackground: string;
  firstPlace: string;
  firstPlaceLight: string;
  secondPlace: string;
  secondPlaceLight: string;
  thirdPlace: string;
  thirdPlaceLight: string;
};

export const TOKENS: Tokens = {
  background: "#123634",
  text: "#d9eceb",
  muted: "#a6bdbb",
  primary: "#265a55",
  primaryHover: "#234f4b",
  success: "#23913b",
  warning: "#e69a3f",
  progress: "#e68a00",
  iconCoin: "#adadad",
  iconGem: "#00a6e6",
  navActive: "#e68a00",
  backgroundGradientStart: "#0d3e39",
  backgroundGradientEnd: "#082725",
  tabBarBackground: "#0F2624",
  tabBarInactive: "#639E90",
  error: "#e74c3c",
  badgeActive: "#8CBCB0",
  accent: "#F9BC60",
  cardBackground: "rgba(146, 146, 146, 0.07)",
  secretBackground: "#974215",
  firstPlace: "#A19A03",
  firstPlaceLight: "#E9D50E",
  secondPlace: "#71646A",
  secondPlaceLight: "#E8E4E6",
  thirdPlace: "#BE5310",
  thirdPlaceLight: "#F4881B",
};

export type AppTheme = {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
};

export type ThemeConfig = Record<ThemeName, AppTheme>;

const Colors: ThemeConfig = {
  light: {
    text: TOKENS.text,
    background: TOKENS.background,
    tint: TOKENS.navActive,
    tabIconDefault: TOKENS.tabBarInactive,
    tabIconSelected: TOKENS.navActive,
  },
  dark: {
    text: TOKENS.text,
    background: TOKENS.background,
    tint: TOKENS.navActive,
    tabIconDefault: TOKENS.tabBarInactive,
    tabIconSelected: TOKENS.navActive,
  },
};

export default Colors;
