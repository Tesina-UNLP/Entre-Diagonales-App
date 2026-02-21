import { TOKENS } from "@/constants/colors";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import { LevelUpToast } from "@/components/toasts/level-up-toast";
import { AuthProvider } from "@/contexts/auth";
import { FontScaleProvider } from "@/contexts/font-scale";
import { HapticsProvider } from "@/contexts/haptics";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConfettiProvider } from "typegpu-confetti/react-native";
import { vexo } from "vexo-analytics";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

// You may want to wrap this with `if (!__DEV__) { ... }` to only run Vexo in production.
if (!__DEV__) {
  vexo(process.env.EXPO_PUBLIC_VEXO_PROJECT_ID || "");
}

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

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: TOKENS.success,
          backgroundColor: TOKENS.tabBarBackground,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 15, fontWeight: "400", color: TOKENS.text }}
        text2Style={{ fontSize: 13, color: TOKENS.muted }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: TOKENS.error,
          backgroundColor: TOKENS.tabBarBackground,
        }}
        text1Style={{ fontSize: 17, color: TOKENS.text }}
        text2Style={{ fontSize: 15, color: TOKENS.muted }}
      />
    ),
    levelUp: (props: any) => <LevelUpToast {...props} />,
  };

  const confettiPalette: [number, number, number, number][] = [
    [190, 83, 16, 1],
    [247, 163, 64, 1],
    [140, 188, 176, 1],
    [249, 188, 96, 1],
    [38, 90, 85, 1],
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <FontScaleProvider>
            <HapticsProvider>
              <AuthProvider>
                <ConfettiProvider
                  initParticleAmount={0}
                  colorPalette={confettiPalette}
                >
                  <Slot screenOptions={{ animation: "fade" }} />
                </ConfettiProvider>
              </AuthProvider>
              <Toast config={toastConfig} />
              <StatusBar style="light" />
            </HapticsProvider>
          </FontScaleProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
