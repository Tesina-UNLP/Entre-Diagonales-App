import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const think = require("@/assets/images/think.png");

/**
 * QuizQuestion Component
 *
 * Este componente muestra la pregunta del quiz con una imagen decorativa.
 *
 * @param question - El texto de la pregunta a mostrar
 */
interface QuizQuestionProps {
  question: string;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({ question }) => {
  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.text}>
        {question}
      </ThemedText>
      <Image source={think} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    width: "100%",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    lineHeight: 30,
    maxWidth: "90%",
  },
  image: {
    width: 100,
    height: 100,
    position: "absolute",
    top: -75,
    right: 0,
    transform: [{ rotate: "10deg" }],
    zIndex: 1,
  },
});
