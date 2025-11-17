import { FadeInView } from "@/components/animations/fade-in-view";
import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { useHaptics } from "@/hooks/use-haptics";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Switch, View } from "react-native";

const Notifications = () => {
  const { hapticsEnabled, toggleHaptics, soundsEnabled, toggleSounds } =
    useHaptics();

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={"Sonidos y Efectos"}
        description={"Configura tus sonidos y efectos"}
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        <FadeInView delay={100}>
          <View style={styles.sectionContainer}>
            <View style={styles.textContainer}>
              <ThemedText type="defaultSemiBold">Vibración</ThemedText>
              <ThemedText type="default" style={styles.description}>
                Habilita o deshabilita la vibración en la app
              </ThemedText>
            </View>
            <Switch value={hapticsEnabled} onValueChange={toggleHaptics} />
          </View>
        </FadeInView>
        <FadeInView delay={200}>
          <View style={styles.sectionContainer}>
            <View style={styles.textContainer}>
              <ThemedText type="defaultSemiBold">Efectos de sonido</ThemedText>
              <ThemedText type="default" style={styles.description}>
                Habilita o deshabilita los efectos de sonido en la app
              </ThemedText>
            </View>
            <Switch value={soundsEnabled} onValueChange={toggleSounds} />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  textContainer: {
    flex: 1,
    gap: 5,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default Notifications;
