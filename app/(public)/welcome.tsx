import Logo from "@/components/icons/logo";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { router } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const Welcome = () => {
  return (
    <ThemedBackground style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
        <ThemedText type="title">Entre Diagonales</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Explora la historia de La Plata
        </ThemedText>
        <ThemedText type="muted" style={styles.description}>
          Descubre monumentos, desbloquea historia y gana recompensas mientras
          exploras las singulares calles diagonales de la ciudad.
        </ThemedText>
      </View>

      <View style={styles.buttonsContainer}>
        <ThemedButton
          variant="gold"
          onPress={() => router.push("/(public)/sign-in")}
        >
          Iniciar la exploracion
        </ThemedButton>
        <ThemedButton
          variant="outline"
          onPress={() => router.push("/(public)/sign-up")}
        >
          Aun no tengo una cuenta
        </ThemedButton>
      </View>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  subtitle: {
    color: TOKENS.muted,
    marginTop: 5,
  },
  description: {
    color: TOKENS.muted,
    textAlign: "center",
    maxWidth: Platform.OS === "ios" ? 300 : 240,
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,
    width: "100%",
    gap: 10,
  },
});

export default Welcome;
