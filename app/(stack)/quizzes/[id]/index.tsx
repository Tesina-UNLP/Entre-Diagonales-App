import { FadeInView } from "@/components/animations/fade-in-view";
import {
  QuizActions,
  QuizAnswersList,
  QuizHeader,
  QuizQuestion,
} from "@/components/quiz";
import { ThemedBackground } from "@/components/themed-background";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { useHaptics } from "@/hooks/use-haptics";
import { api } from "@/libs/api";
import { QuizApiResponse } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const QuizPage = () => {
  const { user, checkAuthState } = useAuth();
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
          await checkAuthState?.();
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
      <FadeInView delay={100}>
        <QuizHeader />
      </FadeInView>

      {/* Contenido principal del quiz */}
      <View style={styles.content}>
        {/* Pregunta del quiz */}
        {quiz && (
          <FadeInView delay={200}>
            <QuizQuestion question={quiz.name} />
          </FadeInView>
        )}

        {/* Lista de respuestas */}
        {quiz && (
          <FadeInView delay={300}>
            <QuizAnswersList
              answers={quiz.answers}
              selectedAnswer={selectedAnswer}
              correctAnswer={correctAnswer}
              onAnswerPress={handleAnswer}
            />
          </FadeInView>
        )}
      </View>

      {/* Botones de acción */}
      <FadeInView delay={400} style={styles.actionsContainer}>
        <QuizActions
          selectedAnswer={selectedAnswer}
          correctAnswer={correctAnswer}
          onCheckAnswer={handleCheckAnswer}
        />
      </FadeInView>
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
  actionsContainer: {
    width: "100%",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default QuizPage;
