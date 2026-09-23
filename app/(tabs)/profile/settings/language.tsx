import { FadeInView } from "@/components/animations/fade-in-view";
import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useLanguage } from "@/hooks/use-language";
import { AppLanguage } from "@/i18n/resources";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

const OPTIONS: { value: AppLanguage; nativeLabel: string; labelKey: string }[] =
  [
    { value: "es", nativeLabel: "Español", labelKey: "language.spanish" },
    { value: "en", nativeLabel: "English", labelKey: "language.english" },
    { value: "pt", nativeLabel: "Português", labelKey: "language.portuguese" },
  ];

export default function LanguageSettings() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={t("language.title")}
        description={t("language.description")}
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        <FadeInView delay={100} style={styles.intro}>
          <ThemedText type="defaultSemiBold">
            {t("language.sectionTitle")}
          </ThemedText>
          <ThemedText type="muted">
            {t("language.sectionDescription")}
          </ThemedText>
        </FadeInView>

        <FadeInView delay={200} style={styles.options}>
          {OPTIONS.map((option) => {
            const selected = language === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={t(option.labelKey)}
                testID={`language-option-${option.value}`}
                onPress={() => void setLanguage(option.value)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <View style={styles.optionText}>
                  <ThemedText type="defaultSemiBold" translateContent={false}>
                    {option.nativeLabel}
                  </ThemedText>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={TOKENS.background}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </FadeInView>
      </View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    paddingInline: 0,
    paddingHorizontal: 0,
  },
  content: { flex: 1, paddingHorizontal: 40, paddingTop: 24, gap: 28 },
  intro: { gap: 6 },
  options: { gap: 12 },
  option: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: TOKENS.muted,
    borderRadius: 14,
  },
  optionSelected: {
    borderColor: TOKENS.primary,
    backgroundColor: `${TOKENS.primary}18`,
  },
  optionText: { gap: 3 },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: TOKENS.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: TOKENS.primary,
    backgroundColor: TOKENS.primary,
  },
});
