// hooks/useThemeColors.ts
import { useColorScheme } from 'react-native';
import Colors, { ThemeName, TOKENS } from '../constants/Colors';

export function useThemeName(): ThemeName {
  const scheme = useColorScheme();
  return (scheme === 'dark' ? 'dark' : 'light') as ThemeName;
}

export function useThemeColor() {
  const themeName = useThemeName();
  const theme = Colors[themeName];
  return { themeName, theme, TOKENS };
}
