import {
  QuizActions,
  QuizAnswersList,
  QuizHeader,
  QuizQuestion,
} from "@/components/quiz";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { useHaptics } from "@/hooks/use-haptics";
import { api } from "@/libs/api";
import { QuizApiResponse } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const QuizPage = () => {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idStr = useMemo(() => (Array.isArray(id) ? id?.[0] : id), [id]);
  const [quiz, setQuiz] = useState<QuizApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const { playSound } = useHaptics();

  const handleGetQuiz = useCallback(async () => {
    setLoading(true);
    if (user) {
      const response = await api.getQuiz(user.access, parseInt(idStr));
      if (response) {
        setQuiz(response);
      }
    }
    setLoading(false);
  }, [user, idStr]);

  useEffect(() => {
    handleGetQuiz();
  }, [handleGetQuiz]);

  /**
   * handleAnswer
   *
   * Esta función maneja la selección de una respuesta.
   * Solo permite seleccionar si aún no se ha verificado la respuesta.
   *
   * @param answerId - ID de la respuesta seleccionada
   */
  const handleAnswer = useCallback(
    (answerId: number) => {
      // Si ya se verificó la respuesta (correctAnswer tiene valor), no permitir cambios
      if (correctAnswer !== null) return;
      setSelectedAnswer(answerId);
    },
    [correctAnswer],
  );

  /**
   * handleCheckAnswer
   *
   * Esta función envía la respuesta seleccionada al servidor para verificarla.
   * Actualiza el estado con la respuesta correcta una vez recibida.
   */
  const handleCheckAnswer = async () => {
    if (user) {
      const response = await api.solveQuiz(
        user.access,
        parseInt(idStr),
        selectedAnswer!,
      );
      if (response) {
        setCorrectAnswer(response.correct_answer_id);

        if (response.correct_answer_id === selectedAnswer) {
          playSound("success");
        } else {
          playSound("error");
        }
      }
    }
  };

  if (loading || !quiz) {
    return (
      <ThemedBackground style={styles.container}>
        <ActivityIndicator size="large" color={TOKENS.primary} />
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground style={styles.container}>
      {/* Encabezado del quiz con título y recompensas */}
      <QuizHeader />

      {/* Contenido principal del quiz */}
      <View style={styles.content}>
        {/* Pregunta del quiz */}
        {quiz && <QuizQuestion question={quiz.name} />}

        {/* Lista de respuestas */}
        {quiz && (
          <QuizAnswersList
            answers={quiz.answers}
            selectedAnswer={selectedAnswer}
            correctAnswer={correctAnswer}
            onAnswerPress={handleAnswer}
          />
        )}

        {/* Sección de power-ups (actualmente solo muestra 50/50) */}
        <View style={styles.powerupsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.powerupsText}>
            50/50
          </ThemedText>
        </View>
      </View>

      {/* Botones de acción */}
      <QuizActions
        selectedAnswer={selectedAnswer}
        correctAnswer={correctAnswer}
        onCheckAnswer={handleCheckAnswer}
      />
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  content: {
    width: "100%",
    gap: 10,
  },
  powerupsContainer: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    gap: 20,
    width: 85,
    justifyContent: "center",
  },
  powerupsText: {
    flex: 1,
    textAlign: "center",
  },
});

export default QuizPage;
