import { FadeInView } from "@/components/animations/fade-in-view";
import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { FONT_SCALE_LEVELS, FontScaleLevel } from "@/contexts/font-scale";
import { useFontScale } from "@/hooks/use-font-scale";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Appearance = () => {
  const { userFontScale, setUserFontScale } = useFontScale();

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={"Apariencia"}
        description={"Ajusta el tamaño del texto"}
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        <FadeInView delay={100}>
          <View style={styles.sectionContainer}>
            <ThemedText type="defaultSemiBold">Tamaño de texto</ThemedText>
            <ThemedText type="muted">
              Elige el tamaño de letra que mejor se adapte a tu pantalla
            </ThemedText>
          </View>
        </FadeInView>

        <FadeInView delay={200}>
          <View style={styles.optionsRow}>
            {FONT_SCALE_LEVELS.map((level) => {
              const active = userFontScale === level.value;
              return (
                <TouchableOpacity
                  key={level.value}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() =>
                    setUserFontScale(level.value as FontScaleLevel)
                  }
                >
                  {/* Usamos Text plano para que el tamaño del control no se autoescale */}
                  <Text
                    style={[
                      styles.optionLabel,
                      active && styles.optionLabelActive,
                    ]}
                  >
                    {level.label}
                  </Text>
                  <Text
                    style={[
                      styles.previewText,
                      { fontSize: 14 * level.value },
                      active ? styles.optionLabelActive : styles.previewMuted,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    Aa
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </FadeInView>
      </View>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    paddingInline: 0,
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 30,
  },
  sectionContainer: {
    gap: 6,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: TOKENS.muted,
  },
  optionActive: {
    borderColor: TOKENS.primary,
    backgroundColor: TOKENS.primary + "18",
  },
  optionLabel: {
    fontSize: 12,
    fontFamily: "ClashDisplaySemiBold",
    color: TOKENS.text,
    textAlign: "center",
  },
  optionLabelActive: {
    color: TOKENS.primary,
  },
  previewText: {
    fontFamily: "ClashDisplay",
    textAlign: "center",
  },
  previewMuted: {
    color: TOKENS.muted,
  },
});

export default Appearance;
