import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Slot } from "expo-router";
import { useEffect } from "react";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ClashDisplay: require("../assets/fonts/ClashDisplay-Regular.otf"),
    ClashDisplayBold: require("../assets/fonts/ClashDisplay-Bold.otf"),
    ClashDisplaySemiBold: require("../assets/fonts/ClashDisplay-Semibold.otf"),
    ClashDisplayMedium: require("../assets/fonts/ClashDisplay-Medium.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Slot screenOptions={{ animation: "fade" }} />
      </AuthProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
