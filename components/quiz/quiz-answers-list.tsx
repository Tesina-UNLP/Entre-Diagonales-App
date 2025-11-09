import { QuizApiResponse } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { QuizAnswer } from "./quiz-answer";

// Alfabeto para las letras de las respuestas
const alphabet = ["A", "B", "C", "D", "E"];

/**
 * QuizAnswersList Component
 *
 * Este componente muestra la lista completa de respuestas del quiz.
 * Maneja la lógica de determinar qué respuesta está seleccionada,
 * cuál es la correcta y cuál es incorrecta.
 *
 * @param answers - Array de respuestas del quiz
 * @param selectedAnswer - ID de la respuesta seleccionada por el usuario
 * @param correctAnswer - ID de la respuesta correcta (null si aún no se verificó)
 * @param onAnswerPress - Función a ejecutar cuando se presiona una respuesta
 */
interface QuizAnswersListProps {
  answers: QuizApiResponse["answers"];
  selectedAnswer: number | null;
  correctAnswer: number | null;
  onAnswerPress: (answerId: number) => void;
}

export const QuizAnswersList: React.FC<QuizAnswersListProps> = ({
  answers,
  selectedAnswer,
  correctAnswer,
  onAnswerPress,
}) => {
  return (
    <View style={styles.container}>
      {answers.map((answer, index) => {
        // Determinar si esta respuesta es la correcta
        const isCorrect = correctAnswer === answer.id;
        // Determinar si esta respuesta fue seleccionada por el usuario
        const isSelected = selectedAnswer === answer.id;
        // Determinar si la respuesta fue incorrecta (usuario la seleccionó pero no es la correcta)
        const isIncorrect = correctAnswer !== null && isSelected && !isCorrect;
        // Determinar si ya se verificó la respuesta
        const isAnswered = correctAnswer !== null;

        return (
          <QuizAnswer
            key={answer.id}
            letter={alphabet[index]}
            text={answer.name}
            isSelected={isSelected}
            isCorrect={isCorrect}
            isIncorrect={isIncorrect}
            isAnswered={isAnswered}
            onPress={() => onAnswerPress(answer.id)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
});
