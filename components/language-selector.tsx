import { TOKENS } from "@/constants/colors";
import { AppLanguage } from "@/i18n/resources";
import { useLanguage } from "@/hooks/use-language";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

export function LanguageSelector({ style }: { style?: ViewStyle }) {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const nextLanguage: AppLanguage =
    language === "es" ? "en" : language === "en" ? "pt" : "es";
  const nextLanguageLabel =
    nextLanguage === "es"
      ? "language.selectSpanish"
      : nextLanguage === "en"
        ? "language.selectEnglish"
        : "language.selectPortuguese";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={t(nextLanguageLabel)}
      testID="language-selector"
      onPress={() => void setLanguage(nextLanguage)}
      style={[styles.container, style]}
    >
      <Text style={styles.label}>{language.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: TOKENS.muted,
    fontFamily: "ClashDisplaySemiBold",
    fontSize: 16,
  },
});
