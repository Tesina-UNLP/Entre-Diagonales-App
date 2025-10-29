import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";

interface PresentationStep {
  id: number;
  title: string;
  description: string;
}

const presentationImages: { [key: number]: any } = {
  1: require("../../assets/images/onboarding/step_1.png"),
  2: require("../../assets/images/onboarding/step_2.png"),
  3: require("../../assets/images/onboarding/step_3.png"),
};

const presentationSteps: PresentationStep[] = [
  {
    id: 1,
    title: "Escanea los monumentos ",
    description:
      "Completa los recorridos y desbloquea items secretos con tu camara",
  },
  {
    id: 2,
    title: "Gana puntos y compite con amigos",
    description:
      "Completa desafios y trivias para recolectar puntos y subir en el ranking global",
  },
  {
    id: 3,
    title: "Descubre la historia de la ciudad",
    description:
      "Haz los recorridos que mas te interesen y aprende sobre la historia y cultura local",
  },
];

const Presentation = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < presentationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    router.replace("/(onboarding)/choice");
  };

  const step = presentationSteps[currentStep];

  return (
    <ThemedBackground style={styles.container}>
      <View style={styles.header}>
        <View style={styles.actionBack}>
          {step.id > 1 && (
            <TouchableOpacity onPress={() => setCurrentStep(currentStep - 1)}>
              <MaterialIcons name="arrow-back" size={24} color={TOKENS.muted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${((currentStep + 1) / (presentationSteps.length + 1)) * 100}%`,
              },
            ]}
          />
        </View>

        <TouchableOpacity style={styles.actionNext} onPress={handleSkip}>
          <ThemedText type="default">Saltar</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Image
          source={presentationImages[step.id]}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>
            {step.title}
          </ThemedText>
          <ThemedText type="muted" style={styles.description}>
            {step.description}
          </ThemedText>
        </View>
      </View>

      <View style={styles.navigationContainer}>
        <ThemedButton variant="primary" onPress={handleNext}>
          {currentStep === presentationSteps.length - 1
            ? "Elegir mi personaje"
            : "Siguiente"}
        </ThemedButton>
      </View>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  actionBack: { flex: 1, height: 24 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  skipText: {
    fontSize: 16,
    color: TOKENS.muted,
    fontFamily: "ClashDisplayRegular",
  },
  icon: {
    fontSize: 60,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    textAlign: "center",
    paddingHorizontal: 20,
    fontSize: 18,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  nextButton: {
    backgroundColor: TOKENS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flex: 1,
  },
  nextText: {
    color: TOKENS.text,
    fontSize: 16,
    textAlign: "center",
    fontFamily: "ClashDisplaySemiBold",
  },
  progressBarContainer: {
    width: 100,
    height: 4,
    borderRadius: 2,
    backgroundColor: TOKENS.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: TOKENS.muted,
    borderRadius: 2,
  },
  actionNext: { flex: 1, alignItems: "flex-end" },
  image: { width: 300, height: 300 },
  textContainer: { alignItems: "center", paddingHorizontal: 20, gap: 10 },
});

export default Presentation;
