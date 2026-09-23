import { TOKENS } from "@/constants/colors";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import { LevelUpToast } from "@/components/toasts/level-up-toast";
import { NotificationLifecycle } from "@/components/notification-lifecycle";
import { ErrorRecoveryScreen } from "@/components/error-recovery-screen";
import { AuthProvider } from "@/contexts/auth";
import { FontScaleProvider } from "@/contexts/font-scale";
import { HapticsProvider } from "@/contexts/haptics";
import { LanguageProvider } from "@/contexts/language";
import { StartupProvider } from "@/contexts/startup";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Observe, ObserveRoot } from "expo-observe";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConfettiProvider } from "@/components/confetti";
import { translateUiText } from "@/i18n";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "react-i18next";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-react-native";
import {
  posthog,
  setTelemetryLanguage,
  syncSessionReplayConsent,
  trackProductEvent,
} from "@/libs/telemetry";
import { useEffect } from "react";

Observe.configure({
  integrations: {
    "expo-router": {
      filteredParams: ["access", "refresh", "token"],
    },
  },
});

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const colorScheme = useColorScheme();
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    setTelemetryLanguage(language);
  }, [language]);

  useEffect(() => {
    void syncSessionReplayConsent();
    trackProductEvent("app_opened");
  }, []);

  const localizeToastText = (value?: string) =>
    value ? translateUiText(value) : value;
  const localizeErrorDetail = (value?: string) => {
    if (!value) return value;
    const translated = translateUiText(value);
    if (language === "en" && translated === value) {
      console.warn("Untranslated server error hidden from English UI:", value);
      return t("common.genericError");
    }
    return translated;
  };

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        text1={localizeToastText(props.text1)}
        text2={localizeToastText(props.text2)}
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
        text1={localizeToastText(props.text1)}
        text2={localizeErrorDetail(props.text2)}
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <FontScaleProvider>
        <HapticsProvider>
          <PostHogProvider
            client={posthog}
            autocapture={{ captureScreens: false, captureTouches: false }}
          >
            <PostHogErrorBoundary fallback={ErrorRecoveryScreen}>
              <AuthProvider>
                <NotificationLifecycle />
                <StartupProvider>
                  <ConfettiProvider
                    initParticleAmount={0}
                    colorPalette={confettiPalette}
                  >
                    <Slot screenOptions={{ animation: "fade" }} />
                  </ConfettiProvider>
                </StartupProvider>
              </AuthProvider>
            </PostHogErrorBoundary>
          </PostHogProvider>
          <Toast config={toastConfig} />
          <StatusBar style="light" />
        </HapticsProvider>
      </FontScaleProvider>
    </ThemeProvider>
  );
}

const confettiPalette: [number, number, number, number][] = [
  [190, 83, 16, 1],
  [247, 163, 64, 1],
  [140, 188, 176, 1],
  [249, 188, 96, 1],
  [38, 90, 85, 1],
];

function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ClashDisplay: require("../assets/fonts/ClashDisplay-Regular.otf"),
    ClashDisplayBold: require("../assets/fonts/ClashDisplay-Bold.otf"),
    ClashDisplaySemiBold: require("../assets/fonts/ClashDisplay-Semibold.otf"),
    ClashDisplayMedium: require("../assets/fonts/ClashDisplay-Medium.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default ObserveRoot.wrap(RootLayout);
