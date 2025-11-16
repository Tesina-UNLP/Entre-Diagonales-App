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

import { AuthProvider } from "@/contexts/auth";
import { HapticsProvider } from "@/contexts/haptics";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { LevelUpToast } from "@/components/toasts/level-up-toast";

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <HapticsProvider>
          <AuthProvider>
            <Slot screenOptions={{ animation: "fade" }} />
          </AuthProvider>
          <Toast config={toastConfig} />
          <StatusBar style="light" />
        </HapticsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
