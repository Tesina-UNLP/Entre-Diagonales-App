// constants/Colors.ts

export type ThemeName = 'light' | 'dark';

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
  navActive: string; // también lo usamos como "tint"
  backgroundGradientStart: string;
  backgroundGradientEnd: string;
  tabBarBackground: string;
  tabBarInactive: string;
};

export const TOKENS: Tokens = {
  background: '#123634',
  text: '#d9eceb',
  muted: '#a6bdbb',
  primary: '#265a55',
  primaryHover: '#234f4b',
  success: '#23913b',
  warning: '#e69a3f',
  progress: '#e68a00',
  iconCoin: '#adadad',
  iconGem: '#00a6e6',
  navActive: '#e68a00',
  backgroundGradientStart: '#0d3e39',
  backgroundGradientEnd: '#082725',
  tabBarBackground: '#0F2624',
  tabBarInactive: '#639E90',
};

export type AppTheme = {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
};

export type ThemeConfig = Record<ThemeName, AppTheme>;

// Mismo esquema para light y dark (unificado con tu paleta)
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
