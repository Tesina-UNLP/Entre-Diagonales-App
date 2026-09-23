import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import type { PostHogErrorBoundaryFallbackProps } from "posthog-react-native";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

export function ErrorRecoveryScreen({
  resetError,
}: PostHogErrorBoundaryFallbackProps) {
  const { t } = useTranslation();

  return (
    <ThemedBackground style={styles.background}>
      <View style={styles.content} accessibilityRole="alert">
        <ThemedText type="title" style={styles.title}>
          {t("telemetry.errorTitle")}
        </ThemedText>
        <ThemedText type="bigMuted" style={styles.message}>
          {t("telemetry.errorMessage")}
        </ThemedText>
        <ThemedButton onPress={resetError} accessibilityRole="button">
          {t("telemetry.retry")}
        </ThemedButton>
      </View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    textAlign: "center",
  },
  message: {
    textAlign: "center",
  },
});
